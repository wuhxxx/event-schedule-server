const Joi = require("joi");

module.exports = Joi.object().keys({
    title: Joi.string().required(),
    location: Joi.string(),
    description: Joi.string(),
    startAt: Joi.number()
        .min(0)
        .max(1440)
        .required(),
    endAt: Joi.number()
        .min(0)
        .max(1440)
        .greater(Joi.ref("startAt"))
        .required(),
    dayOfWeek: Joi.number()
        .min(1)
        .max(7)
        .required()
});
