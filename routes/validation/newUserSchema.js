const Joi = require("joi");

const userSchema = Joi.object().keys({
    name: Joi.string()
        .required()
        .regex(/^(?=.{2,12}$)(?![.\s])[a-zA-Z0-9._\s]+(?<![.\s])$/),
    email: Joi.string()
        .required()
        .email({ minDomainAtoms: 2 }),
    password: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9!@#$%^&]{4,30}$/)
});

module.exports = userSchema;
