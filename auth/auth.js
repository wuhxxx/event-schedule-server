// Bring in strategy(s) and config
const jwtStrategy = require("./jwtStrategy.js"),
    { JWT_AUTH_OPTIONS } = require("../config/serverConfig.js");

// Bring in passport
const passport = require("passport");

// Bring in auth related errors
const { Unauthorized, InvalidToken } = require("../util/errorTypes.js");

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
        // use custom callback of passport.js,
        // so that auth error can be caught and handled by server's error handler
        // as well as sending custom auth error response.
        // see: http://www.passportjs.org/docs/authenticate/
        return (req, res, next) => {
            passport.authenticate(
                "jwt",
                JWT_AUTH_OPTIONS,
                (err, user, info) => {
                    // error has been logged in jwtStrategy, no need to log again
                    if (err) next(err);

                    // console.log("info.name = ", info.name);
                    if (!user) {
                        if (info && info.name === "JsonWebTokenError")
                            next(new InvalidToken());
                        else next(new Unauthorized());
                    } else {
                        req.user = user;
                        next();
                    }
                }
            )(req, res, next);
        };
    }
};
