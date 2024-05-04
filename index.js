const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_DB = "mongodb://127.0.0.1:27017/wanderLust";
const Listing = require("./models/listing");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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
app.listen(8080, () => {
  console.log("app is Listening");
});
