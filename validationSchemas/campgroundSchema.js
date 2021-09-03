const Joi = require('joi');

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().uri().required(),
    description: Joi.string(),
  }).required(),
});

module.exports = campgroundSchema;
