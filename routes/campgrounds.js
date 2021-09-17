const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../utilities/middleware');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.route('/new').get(isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// router.route('/new').get(isLoggedIn, campgrounds.renderNewForm);

// router.get('/', catchAsync(campgrounds.index));

// router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router.post(
//   '/',
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCamprground)
// );

// router.get('/:id', catchAsync(campgrounds.showCampground));

// router.put(
//   '/:id',
//   isLoggedIn,
//   isAuthor,
//   validateCampground,
//   catchAsync(campgrounds.updateCampground)
// );

// router.delete(
//   '/:id',
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.deleteCampground)
// );

module.exports = router;
