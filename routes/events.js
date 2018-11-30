// Load dependencies
const express = require("express"),
    auth = require("../auth/auth.js"),
    succeed = require("../util/responseBuilder.js").successResponse;

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
 * Get all events of the corresponding user specified in jwt payload.
 *
 * @method     GET
 * @endpoint   /all
 * @access     Private
 * @returns    An array of event objects (response.data.events)
 */
router.get("/all", auth.jwtAuth(), async (req, res, next) => {
    try {
        // console.dir(req.user);
        const events = await User.findById(req.user._id)
            .populate("events", "-createDate")
            .select("events");

        return res.status(200).json(succeed(events));
    } catch (error) {
        next(error);
    }
});

/**
 * Add a new event for a specific user.
 * These fields of an event are required in req.body:
 *   - title (string)
 *   - startAt (number)
 *   - endAt (number)
 *   - weekday (number)
 *
 * @method     POST
 * @endpoint   /
 * @access     Private
 * @returns    The eventId of the newly added event (response.data.eventId)
 */
router.post("/", auth.jwtAuth(), async (req, res, next) => {
    try {
        // validate req.body
        await Joi.validate(req.body, newEventSchema);

        // save event and get id
        const event = await new Event(req.body).save();

        // find user document and update
        await User.findByIdAndUpdate(
            req.user._id,
            // must use '.id' to access generated event id
            { $push: { events: event.id } },
            { safe: true, upsert: true }
        );

        // response
        return res.status(200).json(succeed({ eventId: event.id }));
    } catch (error) {
        next(error);
    }
});

/**
 * Delete events according to event's id, only those existing events are deleted
 * An array of event's id is required in req.body:
 *   - eventIds (Array of event id, which is a 24-character string)
 *
 * @method     DELETE
 * @endpoint   /
 * @access     Private
 * @returns    An array of event ids which are deleted (response.data.deletedEventsId)
 */
router.delete("/", auth.jwtAuth(), async (req, res, next) => {
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
        return res.status(200).json(succeed({ deletedEventsId: intersection }));
    } catch (error) {
        next(error);
    }
});

/**
 * Update an event
 * A event id and a data object is required in req.body:
 *   - eventId (String)
 *   - data (Object)
 *   An empty data object makes event unchange
 *
 * @method     PATCH
 * @endpoint   /:id
 * @access     Private
 * @returns    The updated event's id
 */
router.patch("/:id", auth.jwtAuth(), async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, updateEventSchema);

        // get the update data, if it is not object but string, parse
        const data =
            typeof req.body.data !== "object"
                ? JSON.parse(req.body.data)
                : req.body.data;

        // check if the event id is in this user's document
        const idToUpdate = req.params.id;
        const user = await User.findById(req.user._id);
        if (user.events.indexOf(idToUpdate) === -1) throw new EventNotFound();

        // find and update
        await Event.findByIdAndUpdate(idToUpdate, { $set: data });

        // response
        return res.status(200).json(succeed({ updatedEventId: idToUpdate }));
    } catch (error) {
        next(error);
    }
});

// Expose routes
module.exports = router;