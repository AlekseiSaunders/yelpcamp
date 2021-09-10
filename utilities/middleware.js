const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in to perform this action.');
    return res.redirect('/login');
  }
  next();
};

module.exports = isLoggedIn;
