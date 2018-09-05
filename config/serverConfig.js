// Import credential
// Node: My credential will not be uploaded to github, you should provide your credential(see credential.js)
const keys = require("./keys.js");

module.exports = {
    // mongoDB URL
    mongoDBURL: keys.mongoDBURL,

    // JWT secretOrKey
    JWTSecretOrKey: keys.JWTSecretKey,

    // Options for passport-jwt authentication
    jwtAuthOptions: {
        // more options :
        // http://www.passportjs.org/docs/authenticate/
        session: false
    },

    // port to listen on
    PORT: process.env.PORT || 3000,

    // token expires time, 1 week
    tokenExpiresTime: 1000 * 60 * 60 * 24 * 7
};
