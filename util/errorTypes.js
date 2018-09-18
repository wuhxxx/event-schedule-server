// Define and expose all error types in this project

// Error has name, http code and message(has default)

/**
 * The error type builder, each error type has name, http code, default message
 * and a member function to retireve corresponding Error object
 *
 * @param {String} name              Error's name
 * @param {Number} code              Error's HTTP status code
 * @param {String} defaultMessage    Error's default message
 *
 * @return {Object} An error type with name, code and default error message
 */
const buildErrorType = (name, code, defaultMessage) => {
    // Error type object
    const errorType = { name, code, defaultMessage };

    /**
     * Function to retrieve corresponding Error object
     * @param {String} [message=default]  Error message
     *
     * @return {Error} Error object
     */
    errorType.getError = (message = defaultMessage) => {
        const err = new Error(message);
        err.name = name;
        err.code = code;
        return err;
    };

    return errorType;
};

// Expose errors
// each error has a default message, also accepts custom message
module.exports = {
    // user errors
    EmailRegistered: buildErrorType(
        "EmailRegistered",
        409,
        "Email address is already registered"
    ),
    UserNotFound: buildErrorType("UserNotFound", 404, "User not found"),
    WrongPassword: buildErrorType("WrongPassword", 400, "Incorrect password"),

    // event errors
    EventNotFound: buildErrorType("EventNotFound", 404, "Event not found")
};
