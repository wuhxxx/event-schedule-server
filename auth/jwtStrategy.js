// User model and server config
const User = require("../models/User.js"),
    config = require("../config/serverConfig.js"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

// JwtStrategy options
const options = {
    // extract jwt token with bearer scheme
    // means token will be sent in request header in a field called "Authorization", ex:
    // Authorization: "Bearer yJhbGciOiJIUzINisInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NT"
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // secret or key
    secretOrKey: config.JWTSecretOrKey
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
            // TODO: use logger
            console.log(err);
            return done(err, false);
        });
});
