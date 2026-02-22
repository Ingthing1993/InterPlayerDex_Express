/**
 * asyncHandler – Wraps async route handlers so rejections are passed to Express's error middleware.
 *
 * WHY IT EXISTS:
 * In Express 4, if an async function throws or returns a rejected promise, Express
 * did NOT automatically pass that error to your error handler—you had to wrap
 * in try/catch and call next(err). Express 5 fixes this and catches async
 * rejections, but this wrapper is still useful for:
 * - Compatibility with Express 4.
 * - Making it explicit in code that "this route can throw and the error handler will catch it."
 *
 * HOW IT WORKS:
 * 1. We return a NEW function that Express will call as the route handler.
 * 2. That function calls your async handler (e.g. getPlayers) and gets back a Promise.
 * 3. If the promise resolves, we do nothing (your handler already sent the response).
 * 4. If the promise rejects, we call next(err), which sends the error to our
 *    errorHandler middleware.
 *
 * USAGE:
 *   router.get('/', asyncHandler(getPlayers));
 *   // Inside getPlayers you can: throw new AppError('Not found', 404);
 *   // and the central error handler will send the JSON response.
 *
 * @param {Function} fn - Async route handler (req, res) => Promise<void>
 * @returns {Function} - Sync function (req, res, next) that runs fn and forwards rejections to next
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
