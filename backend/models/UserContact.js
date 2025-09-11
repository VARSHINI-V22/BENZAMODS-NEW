import mongoose from "mongoose";

const userContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserContact", userContactSchema);
