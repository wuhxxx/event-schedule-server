// Import credential
// Node: My credential will not be uploaded to github, you should provide your credential(see credential.js)
const credential = require("./mLabCredential.js");
//const credential = require("./credential.js");

const username = credential.username,
    password = credential.password;
// exports the hosted mongoDB URL
module.exports = {
    // mlab hosting mongoDB url, or just replace with your local mongoDB url
    mongoURL: `mongodb://${username}:${password}@ds018558.mlab.com:18558/weely-scheduler`
};
