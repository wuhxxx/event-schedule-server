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

// express router
const router = express.Router();

/**
 * Get all events of a specific user
 * @method     GET
 * @endpoint   event/all
 * @access     Private
 */
router.get("/all", auth.jwtAuth(), async (req, res) => {
    try {
        //console.dir(req.user);
        const user = await User.findById(req.user._id).populate(
            "events",
            "-createDate -__v"
        );

        return res
            .status(200)
            .json(responseBuilder.successResponse(user.events));
    } catch (error) {
        // log error
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

/**
 * Add a new event for a specific user
 * @method     POST
 * @endpoint   event/add
 * @access     Private
 */
router.post("/add", auth.jwtAuth(), async (req, res) => {
    try {
        // validate req.body
        await Joi.validate(req.body, newEventSchema);

        // save event and get id
        const event = await new Event(req.body).save();

        // TODO:log new event creat

        // find user document and update
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { events: event } },
            { safe: true, upsert: true }
        );

        // response
        return res
            .status(200)
            .json(responseBuilder.successResponse({ eventId: event.id }));
    } catch (error) {
        // validation error
        if (error.isJoi)
            return res
                .status(400)
                .json(
                    responseBuilder.errorResponse(400, error.details[0].message)
                );

        // TODO: Improve
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

/**
 * delete events
 * @method     POST
 * @endpoint   event/delete
 * @access     Private
 */
router.post("/delete", auth.jwtAuth(), async (req, res) => {
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
        // validation error or invalid mongoDB id
        if (error.name === "ValidationError" || error.name === "CastError")
            return res
                .status(400)
                .json(
                    responseBuilder.errorResponse(
                        400,
                        error.isJoi ? error.details[0].message : error.message
                    )
                );

        // TODO: Improve
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

/**
 * Update a event
 * @method     POST
 * @endpoint   event/update
 * @access     Private
 */
router.post("/update", auth.jwtAuth(), async (req, res) => {
    try {
        // validation
        await Joi.validate(req.body, updateEventSchema);

        // get the update data, if it is not object, parse
        const data =
            typeof req.body.data !== "object"
                ? JSON.parse(req.body.data)
                : req.body.data;

        // check if the event id is in this user's document
        const user = await User.findById(req.user._id);
        if (user.events.indexOf(req.body.eventId) === -1) {
            const err = new Error("Event not found");
            err.name = "NotFound";
            throw err;
        }

        // find and update
        await Event.findByIdAndUpdate(req.body.eventId, { $set: data });

        // response
        return res.status(200).json(
            responseBuilder.successResponse({
                updatedEventId: req.body.eventId
            })
        );
    } catch (error) {
        // validation error or invalid mongoDB id
        if (error.name === "ValidationError" || error.name === "CastError")
            return res
                .status(400)
                .json(
                    responseBuilder.errorResponse(
                        400,
                        error.isJoi ? error.details[0].message : error.message
                    )
                );
        // event not found
        else if (error.name === "NotFound")
            return res
                .status(404)
                .json(responseBuilder.errorResponse(404, error.message));

        // TODO: Improve
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

// Expose routes
module.exports = router;
