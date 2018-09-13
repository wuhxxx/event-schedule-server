const Joi = require("joi");

module.exports = Joi.object().keys({
    eventId: Joi.string()
        .length(24)
        .required()
});
