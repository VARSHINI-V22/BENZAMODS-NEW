// models/ContactMessage.js
import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["new", "read", "archived"], default: "new" }
});

export default mongoose.model("ContactMessage", ContactMessageSchema);