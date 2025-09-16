// backend/models/Enquiry.js
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enquiry", enquirySchema);