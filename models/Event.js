// Bring in mongoose
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        // The event's title, required
        type: String,
        required: true
    },
    detail: {
        // The event's detail, not required
        type: String
    },
    startTime: {
        // The event's start time,
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // startTime must less than endTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    endTime: {
        // The event's end time,
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // endTime must larger than startTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    dayOfWeek: {
        // The event's day of week,
        // range [1,7], Monday to Sunday
        type: Number,
        min: 1,
        max: 7,
        required: true
    },
    createDate: {
        // The date of this event being created
        type: Date,
        default: Date.now
    }
});

// Exports "Event" model
module.exports = mongoose.model("Event", EventSchema);
