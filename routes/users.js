const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
router.get("/singup", (req, res) => {
  res.render("listing/singup.ejs");
});
router.post("/singup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to wanderlust");
    res.redirect("/listing");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/singup");
  }
});
router.get("/login", (req, res) => {
  res.render("listing/login.ejs");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome Back to wanderlust");
    res.redirect("/listing");
  }
);
module.exports = router;
