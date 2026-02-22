/**
 * Single entry point for all error-handling utilities.
 * Use: const { AppError, errorHandler, asyncHandler, httpStatusCodes } = require('./common/errors');
 */

const AppError = require('./AppError');
const errorHandler = require('./errorHandler');
const asyncHandler = require('./asyncHandler');
const notFound = require('./notFound');
const httpStatusCodes = require('./httpStatusCodes');

module.exports = {
    AppError,
    errorHandler,
    asyncHandler,
    notFound,
    httpStatusCodes,
};
