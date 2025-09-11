const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["car", "bike"], required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
