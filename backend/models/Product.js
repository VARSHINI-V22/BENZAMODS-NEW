const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  category: { type: String, enum: ["car", "bike"], required: true },
});

module.exports = mongoose.model("Product", productSchema);
