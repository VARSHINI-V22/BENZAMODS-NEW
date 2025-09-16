const mongoose = require("mongoose");

const portfolioProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // car or bike
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  beforeAfter: [String], // array of image URLs
  description: String,
  review: String, // sample review
  clientReview: String // sample client review
});

module.exports = mongoose.model("PortfolioProduct", portfolioProductSchema);