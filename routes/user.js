// Load dependencies
const express = require("express"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    responseBuilder = require("../util/responseBuilder.js"),
    config = require("../config/serverConfig.js");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newUserSchema = require("../validation/newUser.js"),
    loginSchema = require("../validation/login.js");

// express router
const router = express.Router();

/**
 * The register route
 * @method     POST
 * @endpoint   user/register
 * @access     Public
 */
router.post("/register", async (req, res) => {
    try {
        // validate input
        await Joi.validate(req.body, newUserSchema);

        // check if email exists in database
        const exists = await User.findOne({ email: req.body.email });
        if (exists) {
            // user with this email exists, throw error
            const err = new Error("This email has been registered");
            err.name = "EmailExists";
            throw err;
        }

        // new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email
        });

        // set hashed password
        newUser.password = await bcrypt.hash(req.body.password, 10);

        // save to database
        const savedUser = await newUser.save();

        // response
        return res.status(200).json(responseBuilder.successResponse(savedUser));
    } catch (error) {
        // validation error
        if (error.name === "ValidationError")
            return res
                .status(400)
                .json(
                    responseBuilder.errorResponse(400, error.details[0].message)
                );
        // email exists
        else if (error.name === "EmailExists")
            return res
                .status(409)
                .json(responseBuilder.errorResponse(409, error.message));

        // TODO: Improve
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

/**
 * The login route, if login succeeds, send back jwt token and user data
 * @method     POST
 * @endpoint   user/login
 * @access     Public
 */
router.post("/login", async (req, res) => {
    try {
        // validation
        await Joi.validate(req.body, loginSchema);

        // check if email already exists in database
        const user = await User.count({ email: req.body.email });
        if (!user) {
            // email has not yet registered, throw error
            const err = new Error("User not found");
            err.name = "UserNotFound";
            throw err;
        }

        // compare password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            // password not match, throw error
            const err = new Error("Password is incorrect");
            err.name = "WrongPassword";
            throw err;
        }

        // assign jwt token
        const jwt_payload = { id: user.id };
        const token = await jwt.sign(jwt_payload, config.JWTSecretOrKey, {
            expiresIn: config.tokenExpiresIn
        });

        // send token back
        return res.status(200).json(responseBuilder.successResponse({ token }));
    } catch (error) {
        // validation error
        if (error.name === "ValidationError")
            return res
                .status(400)
                .json(
                    responseBuilder.errorResponse(400, error.details[0].message)
                );
        // user not found
        else if (error.name === "UserNotFound") {
            return res
                .status(404)
                .json(responseBuilder.errorResponse(404, error.message));
        }
        // wrong password
        else if (error.name === "WrongPassword")
            return res
                .status(400)
                .json(responseBuilder.errorResponse(400, error.message));

        // TODO: Improve
        console.log(error);
        return res
            .status(500)
            .json(responseBuilder.errorResponse(500, error.message));
    }
});

// Expose routes
module.exports = router;
