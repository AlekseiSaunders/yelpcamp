const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../utilities/middleware');
const Campground = require('../models/campground');

// const validateCampground = (req, res, next) => {
//   const { error } = campgroundSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };

// const isAuthor = async (req, res, next) => {
//   const { id } = req.params;
//   const campground = await Campground.findById(id);

//   if (!campground.author.equals(req.user._id)) {
//     req.flash(
//       'error',
//       'Sorry, you need to be the campground author to perform that action'
//     );
//     return res.redirect(`/campgrounds/${id}`);
//   }
//   next();
// };

router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get('/new', isLoggedIn, (req, res, next) => {
  res.render('campgrounds/new');
});

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError('Invalid Campground Data', 400);
    req.flash('success', 'Successfully made a new campground.');
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
      .populate('reviews')
      .populate('author');
    if (!campground) {
      req.flash(
        'error',
        "This campground couldn't be found, check your campground id and try again."
      );
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash(
        'error',
        "This campground couldn't be found, check your campground id and try again."
      );
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated this campground.');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'Successfully deleted a campground');
    res.redirect('/campgrounds');
  })
);

module.exports = router;
