const Joi = require('./escapeHTMLExtension.js');

const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports = campgroundSchema;
