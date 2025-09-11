import express from "express";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import UserContact from "../models/UserContact.js";

const router = express.Router();
const JWT_SECRET = "secret123"; // Use env variable in production

// Admin login
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminUser.findOne({ username, password }); // In production, hash passwords
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get all user messages
router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await UserContact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a specific message
router.delete("/messages/:id", verifyToken, async (req, res) => {
  try {
    await UserContact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
