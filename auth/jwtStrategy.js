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

module.exports = new JwtStrategy(options, (jwt_payload, done) => {
    User.findOne({ id: jwt_payload.id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});
