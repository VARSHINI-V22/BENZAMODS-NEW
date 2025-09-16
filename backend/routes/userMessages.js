import express from "express";
import UserContact from "../models/UserContact.js";

const router = express.Router();

// Submit user message
router.post("/submit", async (req, res) => {
  try {
    const contact = new UserContact(req.body);
    await contact.save();
    res.json({ message: "Your message has been submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;