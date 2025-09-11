const mongoose = require("mongoose");

const modificationSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  name: String,
  image: String,
});

module.exports = mongoose.model("Modification", modificationSchema);
