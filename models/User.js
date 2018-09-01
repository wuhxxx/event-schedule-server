// Bring in mongoose
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

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
    },
    // User's events
    events: [
        {
            // Reference to Event
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
});

// Exports "User" model
module.exports = mongoose.model("User", UserSchema);
