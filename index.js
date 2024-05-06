const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_DB = "mongodb://127.0.0.1:27017/wanderLust";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
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
app.get("/listing", async (req, res) => {
  let allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
});
app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show.ejs", { listing });
});
app.post("/listing", async (req, res) => {
  let listing = new Listing(req.body.listing);
  await listing.save();
  res.redirect("/listing");
});
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
});
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});
app.listen(8080, () => {
  console.log("app is Listening");
});
