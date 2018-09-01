// Bring in mongoose
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    // dayOfWeek: {
    // }
});

module.exports = mongoose.model("Event", EventSchema);
