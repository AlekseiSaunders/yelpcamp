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
const upload = multer({ dest: 'uploads/' });

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  // .post(
  //   isLoggedIn,
  //   validateCampground,
  //   catchAsync(campgrounds.createCampground)
  .post(upload.array('image'), (req, res, next) => {
    console.log(req.body, req.file);
  });

router.route('/new').get(isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
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
