const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_DB = "mongodb://127.0.0.1:27017/wanderLust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const singupRouter = require("./routes/users.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
main()
  .then(console.log("Mongo db Connected"))
  .catch((err) => console.log(err));
async function main() {
  mongoose.connect(MONGO_DB);
}
const sessionOption = {
  secret: "myScereteOptioKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100,
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.send("App is Working");
});
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", singupRouter);
// app.get("/demouser", async (req, res) => {
//   let fakeUser = {
//     email: "abc@gmail.com",
//     username: "DemoUSer",
//   };
//   let newUSer = await User.register(fakeUser, "abcd1234");
//   res.send(newUSer);
// });
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("app is Listening");
});
