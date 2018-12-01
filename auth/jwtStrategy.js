// User model and server config
const User = require("../models/User.js"),
    { JWT_SECRET_OR_KEY } = require("../config/serverConfig.js"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt,
    logger = require("../util/loggers.js").logger;

// JwtStrategy options
const options = {
    // extract jwt token with bearer scheme
    // means token will be sent in request header in a field called "Authorization",
    // i.e.: Authorization: "Bearer yJhbGciOiJIUzNisInIkpXVCJ9.eyJzdWIiiIxMj0NT"
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // secret or key
    secretOrKey: JWT_SECRET_OR_KEY
};

// Expoese the jwt strategy
module.exports = new JwtStrategy(options, (jwt_payload, done) => {
    // fix: findOne -> findById
    User.findById(jwt_payload.id)
        .then(user => {
            if (user) {
                // user will be attached to req
                // access by req.user
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => {
            logger.error(err);
            return done(err, false);
        });
});
