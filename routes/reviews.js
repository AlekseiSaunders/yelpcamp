const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewSchema = require('../validationSchemas/reviewSchema.js');
const ExpressError = require('../utilities/ExpressError');
const {
  isLoggedIn,
  validateReview,
  isAuthor,
} = require('../utilities/middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utilities/catchAsync');

router.post(
  '/',
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a new review.');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleted', 'Successfully deleted a review.');
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
