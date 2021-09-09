const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const isLoggedIn = require('../utilities/middleware');

router.get('/register', (req, res, next) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
    }
  })
);

router.get('/login', (req, res, next) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res, next) => {
    req.flash(
      'success',
      'You have successfully logged in. Welcome back to Yelp Camp!'
    );
    res.redirect('/campgrounds');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success', 'You have logged out successfully.');
  res.redirect('/campgrounds');
});

module.exports = router;
