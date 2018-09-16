// Define and expose all error types in this project

// Error has a http code and name and message(has default)

// error builder
const builder = (name, code, message) => {
    const err = new Error(message);
    err.name = name;
    err.code = code;
    return err;
};

// Expose errors
module.exports = {
    EventNotFound: builder("EventNotFound", 404, "Event not found")
};
