// Expose server config
module.exports = {
    // mongoDB URL
    mongoDBURL:
        process.env.MONGODBURL ||
        "mongodb://localhost:27017/weekly-scheduler-server",

    // database clean up delay, initially 3 days
    databaseCleanDelay: 1000 * 60 * 60 * 24 * 3,

    // JWT secretOrKey
    JWTSecretOrKey: process.env.JWTSECRETORKEY || "secret",

    // Options for passport-jwt authentication
    jwtAuthOptions: {
        // more options : http://www.passportjs.org/docs/authenticate/
        session: false
    },

    // port to listen on
    PORT: process.env.PORT || 2333,

    // token expires after 1 week (unit: milesecond)
    tokenExpiresIn: 1000 * 60 * 60 * 24 * 7
};
