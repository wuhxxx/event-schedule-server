// Expose server config
module.exports = {
    // mongoDB URL
    MONGODB_URL:
        process.env.MONGODBURL ||
        "mongodb://localhost:27017/event-schedule-server",

    // database clean up delay, initially 3 days
    REGULAR_CLEAN_INTERVAL: 1000 * 60 * 60 * 24 * 3,

    // our server's base api route, including version
    BASE_API_ROUTE: "/api/v1",

    // JWT secretOrKey
    JWT_SECRET_OR_KEY: process.env.JWTSECRETORKEY || "secret",

    // Options for passport-jwt authentication
    JWT_AUTH_OPTIONS: {
        // more options : http://www.passportjs.org/docs/authenticate/
        session: false
    },

    // port to listen on
    PORT: process.env.PORT || 2333,

    // token expires after 1 week (unit: milesecond)
    TOKEN_EXPIRES_IN: 1000 * 60 * 60 * 24 * 7
};
