// models/Modification.js
import mongoose from "mongoose";

const modificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['car', 'bike']
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Modification', modificationSchema);