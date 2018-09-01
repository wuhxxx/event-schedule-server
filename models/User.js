// Bring in mongoose
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({});

module.exports = mongoose.model("Event", UserSchema);
