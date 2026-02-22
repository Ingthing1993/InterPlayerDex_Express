/**
 * Not-found (404) middleware.
 *
 * WHEN IT RUNS:
 * Express matches routes in order. If the request didn't match any route above
 * (e.g. GET /api/unknown), no handler runs. So we register this AFTER all
 * real routes but BEFORE the error handler. Any request that reaches this
 * middleware has "fallen through" all routes—so we treat it as "route not found".
 *
 * WHAT IT DOES:
 * We don't send the response here; we call next(error). That passes the error
 * to our central errorHandler, which sends a consistent JSON response. So 404s
 * look like: { success: false, message: "Resource not found" } with status 404.
 *
 * ORDER IN APP.JS:
 *   app.use('/api/players', playerRoutes);
 *   app.use(notFound);   // catch any path that didn't match
 *   app.use(errorHandler);
 */
const AppError = require('./AppError');
const { NOT_FOUND } = require('./httpStatusCodes');

function notFound(req, res, next) {
    next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, NOT_FOUND));
}

module.exports = notFound;
