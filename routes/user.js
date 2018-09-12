// Load dependencies
const express = require("express"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    config = require("../config/serverConfig");

// Load User and Event model
const User = require("../models/User.js"),
    Event = require("../models/Event.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newUserSchema = require("../validation/newUser"),
    loginSchema = require("../validation/login");

// server error sender
const serverError = (res, error, errorType) => {
    if (errorType === 0) {
        // register error
        error.server = "Fails to register user.";
    } else if (errorType === 1) {
        // login error
        error.server = "Fails to login user.";
    }
    // response 500 internal server error
    return res.status(500).json(error);
};

// express router
const router = express.Router();

/**
 * The register route
 * @method     POST
 * @endpoint   user/register
 * @access     Public
 */
router.post("/register", (req, res) => {
    // "name", "email" and "password" are required for registration
    // Input will be validated using joi
    // server also checks if the email has already been registered

    // error message
    const errorMessage = {};

    // validate input
    const validationResult = Joi.validate(req.body, newUserSchema);
    if (validationResult.error) {
        // input validation fails
        errorMessage.validation = validationResult.error.details[0].message;
        // response 400 bad request
        return res.status(400).json(errorMessage);
    }

    // input is valid, check if user has already exists in database
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // user has already exists
                errorMessage.user = "User already exists.";
                // response 409 conflict
                return res.status(409).json(errorMessage);
            } else {
                // new user
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                // hash password
                bcrypt
                    .hash(newUser.password, 10)
                    .then(hashedValue => {
                        // assign hashed password
                        newUser.password = hashedValue;
                        // save to database
                        newUser
                            .save()
                            .then(user => res.status(200).json(user))
                            .catch(err => {
                                // TODO: use logger
                                console.log(err);
                                return serverError(res, errorMessage, 0);
                            });
                    })
                    .catch(err => {
                        // TODO: use logger
                        console.log(err);
                        return serverError(res, errorMessage, 0);
                    });
            }
        })
        .catch(err => {
            // TODO: log error and handle
            console.log(err);
            return serverError(res, errorMessage, 0);
        });
});

/**
 * The login route
 * @method     POST
 * @endpoint   user/login
 * @access     Public
 */
router.post("/login", (req, res) => {
    // if login succeeds, send jwt token and user's events

    // error message
    const errorMessage = {};

    // validate first
    const validationResult = Joi.validate(req.body, loginSchema);
    if (validationResult.error) {
        // validation fails
        errorMessage.validation = validationResult.error.details[0].message;
        // response 400
        return res.status(400).json(errorMessage);
    }

    // input is valid, check if the email exists in database
    User.findOne({ email: req.body.email })
        .populate("events")
        .then(user => {
            if (user) {
                // user exists, check password
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // password correct, assign jwt token and send events

                            // jwt payload
                            const jwt_payload = {
                                id: user.id,
                                name: user.name
                            };

                            // Sign Token
                            jwt.sign(
                                jwt_payload,
                                config.JWTSecretOrKey,
                                { expiresIn: config.tokenExpiresIn },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token,
                                        events: user.events
                                    });
                                }
                            );
                        } else {
                            // password incorrect
                            errorMessage.password = "Password incorrect.";
                            return res.status(400).json(errorMessage);
                        }
                    })
                    .catch(err => {
                        // TODO: use logger
                        console.log(err);
                        return serverError(res, errorMessage, 1);
                    });
            } else {
                // user not exists
                errorMessage.user = "User does not exist";
                // response 404 not found
                return res.status(404).json(errorMessage);
            }
        })
        .catch(err => {
            // TODO: user logger
            console.log(err);
            return serverError(res, errorMessage, 1);
        });
});

// Expose routes
module.exports = router;
