const Joi = require("joi");

module.exports = Joi.object().keys({
    eventId: Joi.string()
        .length(24)
        .required(),
    data: Joi.object()
        .keys({
            title: Joi.string(),
            location: Joi.string(),
            description: Joi.string(),
            color: Joi.number()
                .min(0)
                .max(16777215), // decimal value of hex 0xFFFFFF
            startAt: Joi.number()
                .min(0)
                .max(1440),
            endAt: Joi.number()
                .min(0)
                .max(1440)
                .greater(Joi.ref("startAt")),
            weekday: Joi.number()
                .min(1)
                .max(5)
        })
        .required()
});
