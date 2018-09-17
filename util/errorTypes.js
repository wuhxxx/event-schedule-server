// Define and expose all error types in this project

// Error has name, http code and message(has default)

// error builder
const builder = (name, code, defaultMessage) => {
    return (message = defaultMessage) => {
        const err = new Error(message);
        err.name = name;
        err.code = code;
        return err;
    };
};

// Expose errors
// each error has a default message, also accepts custom message
module.exports = {
    // user errors
    EmailRegistered: builder(
        "EmailRegistered",
        409,
        "Email address is already registered"
    ),
    UserNotFound: builder("UserNotFound", 404, "User not found"),
    WrongPassword: builder("WrongPassword", 400, "Incorrect password"),

    // event errors
    EventNotFound: builder("EventNotFound", 404, "Event not found")
};
