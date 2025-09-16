const mongoose = require("mongoose");

const vehicleServiceSchema = new mongoose.Schema({
  type: { type: String, enum: ["car", "bike"], required: true },
  name: { type: String, required: true },        // wrap, lights, suspension, ppf
  title: { type: String, required: true },       // heading/title
  description: { type: String, required: true }, // paragraph text
  images: [String],                              // array of image URLs
});

module.exports = mongoose.model("VehicleService", vehicleServiceSchema);