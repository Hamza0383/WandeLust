module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirect = req.originalUrl;
    req.flash("error", "You Must be Logged In");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirect) {
    res.locals.redirectUrl = req.session.redirect;
  }
  next();
};
