const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_DB = "mongodb://127.0.0.1:27017/wanderLust";
const Listing = require("./models/listing");
const Review = require("./models/reviews");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
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
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  let errMsg = error.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errMsg = error.details.map((el) => el.message).join(",");
  if (error) {
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
app.get("/", (req, res) => {
  res.send("App is Working");
});
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);
app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);
app.post(
  "/listing",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listing");
  })
);
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);
app.put(
  "/listing/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new Error(400, "Send valid Data for Listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
  })
);
app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);
app.post("/listing/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  console.log(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listing/${listing._id}`);
});
app.delete(
  "/listing/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(req.params);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
  })
);
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
