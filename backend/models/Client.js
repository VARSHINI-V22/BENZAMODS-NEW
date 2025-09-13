// backend/models/Client.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Client Schema (instead of User)
const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    cart: [{
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PortfolioProduct' 
      },
      quantity: { 
        type: Number, 
        default: 1 
      }
    }],
    wishlist: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'PortfolioProduct' 
    }]
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// Encrypt password before saving
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match entered password with hashed password in DB
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model
const Client = mongoose.model("Client", clientSchema);
export default Client;