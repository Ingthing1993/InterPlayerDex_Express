/**
 * AppError – Custom error class for "operational" errors in the application.
 *
 * WHAT IT IS:
 * Operational errors are ones we expect and handle in code (e.g. "user not found",
 * "invalid credentials", "validation failed"). We give them a clear HTTP status
 * and message so the client gets a proper API response.
 *
 * WHY USE IT:
 * - Controllers can do: throw new AppError('User not found', 404) instead of
 *   manually calling res.status(404).json(...) everywhere.
 * - The central error handler can recognise these (e.g. via isOperational) and
 *   send a clean response without logging them as critical bugs.
 *
 * FLOW:
 * 1. You throw new AppError(message, statusCode) in a route/controller.
 * 2. Express (or our asyncHandler) passes that error to the next() middleware.
 * 3. Our error handler middleware receives it, sees err.isOperational === true,
 *    and sends a JSON response with that status code and message.
 */

class AppError extends Error {
    /**
     * @param {string} message - Human-readable message (safe to send to client in production).
     * @param {number} [statusCode=500] - HTTP status code (e.g. 400, 401, 404, 500).
     */
    constructor(message, statusCode = 500) {
        // Call the parent Error constructor so we get proper stack traces.
        super(message);

        // Set the HTTP status code on the error so the handler can read it.
        this.statusCode = statusCode;

        // Mark as "operational" so the error handler knows this was an intentional
        // business-logic error (e.g. validation, not found), not a programming bug.
        this.isOperational = true;

        // Capture the stack trace at the point where AppError was constructed.
        // This helps with debugging; we don't need to capture it again in the handler.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
