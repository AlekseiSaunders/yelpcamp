const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render('campgrounds/new');
};

module.exports.createCamprground = async (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpressError('Invalid Campground Data', 400);
  req.flash('success', 'Successfully made a new campground.');
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  console.log(campground);
  if (!campground) {
    req.flash(
      'error',
      "This campground couldn't be found, check your campground id and try again."
    );
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
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
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  req.flash('success', 'Successfully updated this campground.');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('deleted', 'Successfully deleted a campground');
  res.redirect('/campgrounds');
};