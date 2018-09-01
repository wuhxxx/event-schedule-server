// Bring in mongoose
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        // User name
        type: String,
        required: true
    },
    email: {
        // User email
        type: String,
        required: true
    },
    password: {
        // User password
        type: String,
        required: true
    },
    date: {
        // Register date
        type: Date,
        default: Date.now
    }
});

// Exports "User" model
module.exports = mongoose.model("User", UserSchema);
