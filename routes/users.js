const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res, next) => {
  res.render('users/register');
});
router.post('/register', async (req, res, next) => {
  res.send(req.body);
});

module.exports = router;
