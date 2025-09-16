import mongoose from "mongoose";

const adminUserSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
});

export default mongoose.model("AdminUser", adminUserSchema);