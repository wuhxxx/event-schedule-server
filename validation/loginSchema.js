const Joi = require("joi");

const loginSchema = Joi.object().keys({
    email: Joi.string()
        .required()
        .email({ minDomainAtoms: 2 }),
    password: Joi.string()
        .required()
        .regex(/^[a-zA-Z0-9!@#$%^&]{4,30}$/)
});

module.exports = loginSchema;
