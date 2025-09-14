// routes/enquiryRoutes.js
import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

// GET all enquiries
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single enquiry
router.get("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json(enquiry);
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new enquiry
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message
    });
    
    await enquiry.save();
    res.status(201).json(enquiry);
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update an enquiry
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, message, status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    
    // Update enquiry fields
    if (name) enquiry.name = name;
    if (email) enquiry.email = email;
    if (phone) enquiry.phone = phone;
    if (message) enquiry.message = message;
    if (status) enquiry.status = status;
    
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    console.error("Error updating enquiry:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE an enquiry
router.delete("/:id", async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;