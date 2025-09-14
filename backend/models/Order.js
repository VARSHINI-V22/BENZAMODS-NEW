// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);