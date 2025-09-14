// models/Vehicle.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'bike']
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema);