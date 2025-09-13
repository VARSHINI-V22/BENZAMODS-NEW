import mongoose from 'mongoose';

const PortfolioProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['car', 'bike']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  beforeAfter: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  review: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PortfolioProduct = mongoose.model('PortfolioProduct', PortfolioProductSchema);

export default PortfolioProduct;