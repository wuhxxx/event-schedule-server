// Load dependencies
const express = require("express"),
    bcrypt = require("bcryptjs"),
    auth = require("../auth/auth.js");

// Load User model
const User = require("../models/User.js");

// Load joi validator and validation schema
const Joi = require("joi"),
    newUserSchema = require("./validation/newUserSchema.js");

// express router
const router = express.Router();

// The register route
// @route    POST user/register
// @access   Public
router.post("/register", (req, res) => {
    // "name", "email" and "password" are required for registration
    // Input will be validated using joi
    // server also checks if the email has already been registered

    // error message
    const errorMessage = {};

    // validate input
    const result = Joi.validate(req.body, newUserSchema);

    if (result.error) {
        // input validation fails
        errorMessage.validationError = result.error.details[0].message;
        // response 400 bad request
        return res.status(400).json(errorMessage);
    }

    // input is valid
    // check if user has already exists in database
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // user has already exists
                errorMessage.userExistsError = `User with email ${
                    req.body.email
                } has already exists, use a different email to register.`;
                // response
                return res.status(400).json(errorMessage);
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
                            });
                    })
                    .catch(err => {
                        // TODO: use logger
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            // TODO: log error and handle
            console.log(err);
            return res.send("Fail to create user.");
        });
});

// Expose routes
module.exports = router;
