const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
// const campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const Joi = require('joi');
const { error } = require('console');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.render('home');
});

app.get(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

app.get('/campgrounds/new', (req, res, next) => {
  res.render('campgrounds/new');
});

app.post(
  '/campgrounds',
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError('Invalid Campground Data', 400);
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required()
      }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(msg, 400);
    }
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
  })
);

app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

app.put(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Unidentified Error';
  res.status(statusCode);
  if (statusCode === 404) {
    res.status(404).render('notfound', { err, statusCode });
  } else {
    res.render('error', { err, statusCode });
  }
});

app.listen(3000, () => {
  console.log('Serving on Port 3000');
});
