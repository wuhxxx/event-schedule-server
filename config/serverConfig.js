// Import credential
// Node: My credential will not be uploaded to github, you should provide your credential(see credential.js)
const keys = require("./keys.js");

module.exports = {
    // mongoDB URL
    mongoDBURL: keys.mongoDBURL,

    // JWT secret
    JWTSecretKey: keys.JWTSecretKey,

    // port to listen on
    PORT: process.env.PORT || 3000,

    // token expires time, 1 week
    tokenExpiresTime: 1000 * 60 * 60 * 24 * 7
};
