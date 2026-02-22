/**
 * Central Error Handler Middleware
 *
 * HOW EXPRESS ERROR HANDLING WORKS:
 * Express recognises error-handling middleware by the fact it has FOUR parameters:
 * (err, req, res, next). When any route or middleware calls next(err), Express
 * skips all remaining normal middleware and routes and invokes the first
 * 4-parameter middleware. So this function is the "catch-all" for errors.
 *
 * WHEN THIS RUNS:
 * 1. A route handler does: throw new AppError('Not found', 404)  →  Express 5
 *    catches async rejections and passes the error here.
 * 2. A route handler does: next(new AppError('Bad request', 400))  →  same.
 * 3. A synchronous throw in a route  →  same (next(err) is called by Express).
 * 4. Mongoose throws (e.g. validation, cast error)  →  we normalise it and respond.
 *
 * FLOW INSIDE THIS FUNCTION:
 * 1. Normalise the error (convert Mongoose/other errors into a consistent shape).
 * 2. Decide what to send to the client (message, status code, extra details in dev).
 * 3. Log appropriately (full details in dev, safe summary in production).
 * 4. Send one JSON response (we never call next() from here—this is the end).
 */

const AppError = require('./AppError');
const { INTERNAL_SERVER_ERROR } = require('./httpStatusCodes');

/**
 * Normalises different error types into a single shape the rest of the handler expects.
 * This way we only have one place that decides statusCode and message.
 *
 * @param {Error} err - The raw error (could be AppError, Mongoose error, or generic Error).
 * @returns {{ statusCode: number, message: string, isOperational: boolean }}
 */
function normalizeError(err) {
    // ----- Our own AppError: already has statusCode and a safe message -----
    if (err instanceof AppError) {
        return {
            statusCode: err.statusCode,
            message: err.message,
            isOperational: err.isOperational,
        };
    }

    // ----- Mongoose ValidationError (e.g. required field missing, type mismatch) -----
    // Mongoose sets err.name === 'ValidationError'. We can send back field-level
    // errors so the client knows which field failed.
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return {
            statusCode: 400,
            message: messages.length ? messages.join('; ') : 'Validation failed',
            isOperational: true,
        };
    }

    // ----- Mongoose CastError (e.g. invalid ObjectId in URL) -----
    // When someone requests /api/players/invalid-id, Mongoose throws CastError.
    if (err.name === 'CastError') {
        return {
            statusCode: 400,
            message: `Invalid value for ${err.path || 'field'}: ${err.value}`,
            isOperational: true,
        };
    }

    // ----- Mongoose duplicate key (E11000) -----
    // Unique index violation; we treat as 409 Conflict.
    if (err.code === 11000) {
        const field = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
        return {
            statusCode: 409,
            message: `Duplicate value for ${field}.`,
            isOperational: true,
        };
    }

    // ----- Anything else (programming errors, third-party lib errors) -----
    // We don't expose internal details to the client in production.
    return {
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong',
        isOperational: false,
    };
}

/**
 * Express error-handling middleware signature: (err, req, res, next).
 * Must be registered AFTER all routes (app.use(routes); app.use(errorHandler);).
 *
 * @param {Error} err - Error passed from next(err) or from an async route rejection.
 * @param {import('express').Request} req - Express request (used for logging and conditional behaviour).
 * @param {import('express').Response} res - Express response; we send exactly one response here.
 * @param {import('express').NextFunction} next - Unused; included so Express recognises this as error middleware.
 */
function errorHandler(err, req, res, next) {
    // Step 1: Normalise so we have statusCode, message, and isOperational.
    const { statusCode, message, isOperational } = normalizeError(err);

    // Step 2: Build the JSON we will send to the client.
    // We use a consistent shape so frontends can always expect { success, message, ... }.
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const payload = {
        success: false,
        message,
    };

    // In development only: add stack trace and optional extra fields for debugging.
    // In production we never send stack traces or internal details to the client.
    if (isDevelopment) {
        payload.stack = err.stack;
        if (err.errors) payload.errors = err.errors; // e.g. Mongoose validation details
    }

    // Step 3: Log the error.
    // Operational errors (e.g. 404, 400) are usually not bugs; we log at a lower level.
    // Programming errors (500, unexpected throws) we log in full so we can fix them.
    if (isOperational) {
        console.warn(`[Operational] ${statusCode} ${message}`);
    } else {
        console.error('[Error]', statusCode, message, err.stack);
    }

    // Step 4: Send the response. We must not call next() after sending—this is the end of the pipeline.
    res.status(statusCode).json(payload);
}

module.exports = errorHandler;
