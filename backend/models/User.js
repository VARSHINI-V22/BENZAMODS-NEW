// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
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
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PortfolioProduct",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "PortfolioProduct"
    }]
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
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
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model
const User = mongoose.model("User", userSchema);
module.exports = User;