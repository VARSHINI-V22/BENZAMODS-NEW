// models/PortfolioProduct.js
import mongoose from "mongoose";

const portfolioProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('PortfolioProduct', portfolioProductSchema);