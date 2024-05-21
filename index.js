const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_DB = "mongodb://127.0.0.1:27017/wanderLust";
const Listing = require("./models/listing");
const Review = require("./models/reviews");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
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

app.get("/", (req, res) => {
  res.send("App is Working");
});
app.use("/listing", listing);
app.use("/listing/:id/reviews", review);

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
