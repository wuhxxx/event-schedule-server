// Load dependencies
const express = require("express"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    responseBuilder = require("../util/responseBuilder.js"),
    config = require("../config/serverConfig.js");

// Load User and Event model
const User = require("../models/User.js");
require("../models/Event.js"); // require for User model to reference

// Load joi validator and validation schema
const Joi = require("joi"),
    newUserSchema = require("../validation/newUser.js"),
    loginSchema = require("../validation/login.js");

// Load error type
const {
    EmailRegistered,
    UserNotFound,
    WrongPassword
} = require("../util/errorTypes.js");

// express router
const router = express.Router();

/**
 * The register route
 * @method     POST
 * @endpoint   user/register
 * @access     Public
 */
router.post("/register", async (req, res, next) => {
    try {
        // validate input
        await Joi.validate(req.body, newUserSchema);

        // check if email exists in database
        const userArray = await User.find({
            email: req.body.email
        }).limit(1);
        // find().limit(1) returns an empty array if email not registered,
        // or an array contains only one element if email registered,
        // if user with this email exists, throw error
        if (userArray.length > 0) throw new EmailRegistered();

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
        next(error);
    }
});

/**
 * The login route, if login succeeds, send back jwt bearer token and username.
 * @method     POST
 * @endpoint   user/login
 * @access     Public
 */
router.post("/login", async (req, res, next) => {
    try {
        // validation
        await Joi.validate(req.body, loginSchema);

        // check if email already exists in database
        const userArray = await User.find({ email: req.body.email }).limit(1);
        // find().limit(1) returns an empty array if user not exists,
        // or an array contains only one element if user exists,
        // if array is empty, throw error
        if (userArray.length === 0) throw new UserNotFound();

        // get pointer to corresponding user document
        const user = userArray[0];

        // conpare password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        // if password not match, throw error
        if (!isMatch) throw new WrongPassword();

        // assign jwt token, payload includes user's id
        const jwt_payload = { id: user.id };
        let token = await jwt.sign(jwt_payload, config.JWTSecretOrKey, {
            expiresIn: config.tokenExpiresIn
        });
        token = `Bearer ${token}`;

        // send jwt bearer token back and username
        const username = user.name;
        return res
            .status(200)
            .json(responseBuilder.successResponse({ token, username }));
    } catch (error) {
        next(error);
    }
});

// Expose routes
module.exports = router;
