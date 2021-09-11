const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewSchema = require('../validationSchemas/reviewSchema.js');
const ExpressError = require('../utilities/ExpressError');
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require('../utilities/middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews');

router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
