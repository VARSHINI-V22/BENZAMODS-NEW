const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioProduct', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  beforeImage: String,
  afterImage: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "pending" } // pending, approved, rejected
});

module.exports = mongoose.model("Review", reviewSchema);