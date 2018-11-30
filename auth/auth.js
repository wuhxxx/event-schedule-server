// Bring in strategy(s) and config
const jwtStrategy = require("./jwtStrategy.js"),
    { JWT_AUTH_OPTIONS } = require("../config/serverConfig.js");

// Bring in passport
const passport = require("passport");

// Use strategy(s)
passport.use(jwtStrategy);

// Expose initialize and authentication(s) as closures
module.exports = {
    // passport.initialize
    initialize: () => {
        return passport.initialize();
    },

    // jwt authenticate
    jwtAuth: () => {
        return passport.authenticate("jwt", JWT_AUTH_OPTIONS);
    }
};
