const Joi = require('./escapeHTMLExtension.js');

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports = reviewSchema;
