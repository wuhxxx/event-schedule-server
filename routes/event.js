// Load dependencies
const express = require("express"),
    auth = require("../auth/auth.js"),
    config = require("../config/serverConfig");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi");

// express router
const router = express.Router();

/**
 * Get all events of a specific user
 * @method     GET
 * @endpoint   event/all
 * @access     Private
 */

/**
 * Add a new event for a specific user
 * @method     POST
 * @endpoint   event/add
 * @access     Private
 */

/**
 * Update a event
 * @method     POST
 * @endpoint   event/update
 * @access     Private
 */

/**
 * Remove events
 * @method     POST
 * @endpoint   event/remove
 * @access     Private
 */
