// Bring in mongoose
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: {
        // event's title, required
        type: String,
        required: true
    },
    location: {
        // event's location
        type: String
    },
    description: {
        // event's description
        type: String
    },
    startAt: {
        // event's start time,
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // startTime must less than endTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    endAt: {
        // event's end time,
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // endTime must larger than startTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    dayOfWeek: {
        // event's day of week,
        // range [1,7], Monday to Sunday
        type: Number,
        min: 1,
        max: 7,
        required: true
    },
    createDate: {
        // date of this event being created
        type: Date,
        default: Date.now
    }
});

// Decorate the returned object when document.toObject() is called:
// replace field name "_id" with "eventId", and delete field "__v"
EventSchema.set("toObject", {
    transform: (document, returnObjcet) => {
        returnObjcet.eventId = returnObjcet._id;
        delete returnObjcet._id;
        delete returnObjcet.__v;
    }
});

// Exports "Event" model
module.exports = mongoose.model("Event", EventSchema);
