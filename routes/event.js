// Load dependencies
const express = require("express"),
    auth = require("../auth/auth.js"),
    config = require("../config/serverConfig");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newEventSchema = require("../validation/newEvent.js"),
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
        const userDoc = await User.findById(req.user._id).populate(
            "events",
            "-createDate -__v"
        );

        return res.status(200).json(userDoc.events);
    } catch (error) {
        // log error
        console.log(error);
        return res.status(500).send("Error processing GET event/all.");
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
        return res.status(200).json({
            success: "New event successfully added.",
            event_id: event.id
        });
    } catch (error) {
        // validation error
        if (error.isJoi)
            return res
                .status(400)
                .json({ validationError: error.details[0].message });

        // TODO: Improve
        console.log(error);
        return res.status(500).send("Error processing POST event/add");
    }
});

/**
 * Update a event
 * @method     POST
 * @endpoint   event/update
 * @access     Private
 */

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
        //console.log(Array.isArray(req.body.eventIds)); // true

        // find corresponding user and remove events' id
        await User.findByIdAndUpdate(req.user._id, {
            $pullAll: { events: req.body.eventIds }
        });

        // delete events in database
        //await Event.deleteMany({});

        // response
        return res.status(200).json({ success: "Events deleted." });
    } catch (error) {
        // validation error
        if (error.isJoi)
            return res
                .status(400)
                .json({ validationError: error.details[0].message });
        // invalid mongoDB id format
        else if (error.name === "CastError")
            return res
                .status(400)
                .json({ invalidId: `No event has id ${error.value}` });

        // TODO: Improve
        console.log(error);
        return res.status(500).send("Error processing POST event/add");
    }
});

// Expose routes
module.exports = router;
