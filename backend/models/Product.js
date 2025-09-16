const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["car", "bike"], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Full image URL
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);