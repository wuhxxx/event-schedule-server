// Handle all types of error,
// including joi validation error, mongodb cast error,
// errors in errorTypes.js and other server errors.

// Load util
const responseBuilder = require("./responseBuilder.js"),
    {
        EmailRegistered,
        UserNotFound,
        WrongPassword,
        EventNotFound
    } = require("./errorTypes.js");

/**
 * Validation error handler middleware
 *   Handle joi validation error
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err.isJoi)
        return res
            .status(400)
            .json(responseBuilder.errorResponse(400, err.details[0].message));
    // pass other errors to sequential error handler middlewares
    else next(err);
};

/**
 * User error handler middleware
 *   Handle all user errors in errorTypes.js,
 *   use switch...case statement for better management of handled error types
 */
const userErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode;
    // switch statement uses strict comparison '==='
    switch (err.name) {
        case EmailRegistered.typeName:
            return res
                .status(statusCode)
                .json(responseBuilder.errorResponse(statusCode, err.message));

        case UserNotFound.typeName:
            return res
                .status(statusCode)
                .json(responseBuilder.errorResponse(statusCode, err.message));

        case WrongPassword.typeName:
            return res
                .status(statusCode)
                .json(responseBuilder.errorResponse(statusCode, err.message));

        default:
            next(err);
    }
};

/**
 * Event error handler middleware
 *   Handle all event errors in errorTypes.js,
 *   use switch...case statement for better management of handled error types
 */
const eventErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode;
    // switch statement uses strict comparison '==='
    switch (err.name) {
        case EventNotFound.typeName:
            return res
                .status(statusCode)
                .json(responseBuilder.errorResponse(statusCode, err.message));

        default:
            next(err);
    }
};

/**
 * Server error handler middleware
 *   Handle all errors other than above errors
 *   these errors can be unexpected, right now, just return internal sever error
 */
const serverErrorHandler = (err, req, res) => {
    return res
        .status(500)
        .json(responseBuilder.errorResponse(500, err.message));
};
module.exports = {
    validationErrorHandler,
    userErrorHandler,
    eventErrorHandler,
    serverErrorHandler
};
