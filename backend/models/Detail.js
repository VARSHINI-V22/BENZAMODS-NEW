const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
  modificationId: { type: mongoose.Schema.Types.ObjectId, ref: "Modification" },
  title: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Detail", detailSchema);