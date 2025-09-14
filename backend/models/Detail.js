// models/Detail.js
import mongoose from "mongoose";

const detailSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Detail', detailSchema);