// Load dependencies
const express = require("express"),
    auth = require("../auth/auth.js"),
    responseBuilder = require("../util/responseBuilder.js");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newEventSchema = require("../validation/newEvent.js"),
    updateEventSchema = require("../validation/updateEvent.js"),
    removeEventSchema = require("../validation/removeEvent.js");

// Load error type
const { EventNotFound } = require("../util/errorTypes.js");

// express router
const router = express.Router();

/**
 * Get all events of a specific user
 * @method     GET
 * @endpoint   event/all
 * @access     Private
 */
router.get("/all", auth.jwtAuth(), async (req, res, next) => {
    try {
        // console.dir(req.user);
        const events = await User.findById(req.user._id)
            .populate("events", "-createDate")
            .select("events");

        return res.status(200).json(responseBuilder.successResponse(events));
    } catch (error) {
        next(error);
    }
});

/**
 * Add a new event for a specific user
 * @method     POST
 * @endpoint   event/add
 * @access     Private
 */
router.post("/add", auth.jwtAuth(), async (req, res, next) => {
    try {
        // validate req.body
        await Joi.validate(req.body, newEventSchema);

        // save event and get id
        const event = await new Event(req.body).save();

        // find user document and update
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { events: event.eventId } },
            { safe: true, upsert: true }
        );

        // response
        return res
            .status(200)
            .json(responseBuilder.successResponse({ eventId: event.id }));
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/**
 * delete events
 * @method     POST
 * @endpoint   event/delete
 * @access     Private
 */
router.post("/delete", auth.jwtAuth(), async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, removeEventSchema);

        // find corresponding user
        const user = await User.findById(req.user._id);

        // filter out events which does not belong to this user
        const intersection = req.body.eventIds.filter(
            eventid => user.events.indexOf(eventid) !== -1
        );

        // remove events from user's events array and Events collection
        await user.updateOne({ $pullAll: { events: intersection } });
        await Event.deleteMany({ _id: { $in: intersection } });

        // response
        return res.status(200).json(
            responseBuilder.successResponse({
                deletedEventsId: intersection
            })
        );
    } catch (error) {
        next(error);
    }
});

/**
 * Update an event
 * @method     POST
 * @endpoint   event/update
 * @access     Private
 */
router.post("/update", auth.jwtAuth(), async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, updateEventSchema);

        // get the update data, if it is not object but string, parse
        const data =
            typeof req.body.data !== "object"
                ? JSON.parse(req.body.data)
                : req.body.data;

        // check if the event id is in this user's document
        const user = await User.findById(req.user._id);
        if (user.events.indexOf(req.body.eventId) === -1)
            throw new EventNotFound();

        // find and update
        await Event.findByIdAndUpdate(req.body.eventId, { $set: data });

        // response
        return res.status(200).json(
            responseBuilder.successResponse({
                updatedEventId: req.body.eventId
            })
        );
    } catch (error) {
        next(error);
    }
});

// Expose routes
module.exports = router;
