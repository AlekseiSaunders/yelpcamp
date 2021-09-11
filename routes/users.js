const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const isLoggedIn = require('../utilities/middleware');
const users = require('../controllers/users');

router.get('/register', users.renderRegister);

router.post(
  '/register',
  catchAsync(users.registerUser)
);

router.get('/login', users.renderLogin);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  users.loginUser
);

router.get('/logout', users.logoutUser);

module.exports = router;
