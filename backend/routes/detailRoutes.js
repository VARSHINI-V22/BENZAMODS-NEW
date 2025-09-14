// routes/detailRoutes.js
import express from "express";
import Detail from "../models/Detail.js";

const router = express.Router();

// GET all details
router.get("/", async (req, res) => {
  try {
    const details = await Detail.find();
    res.json(details);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single detail
router.get("/:id", async (req, res) => {
  try {
    const detail = await Detail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: "Detail not found" });
    }
    res.json(detail);
  } catch (error) {
    console.error("Error fetching detail:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new detail
router.post("/", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const detail = new Detail({
      title,
      content,
      category
    });
    
    await detail.save();
    res.status(201).json(detail);
  } catch (error) {
    console.error("Error creating detail:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a detail
router.put("/:id", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const detail = await Detail.findById(req.params.id);
    
    if (!detail) {
      return res.status(404).json({ message: "Detail not found" });
    }
    
    // Update detail fields
    if (title) detail.title = title;
    if (content) detail.content = content;
    if (category) detail.category = category;
    
    await detail.save();
    res.json(detail);
  } catch (error) {
    console.error("Error updating detail:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a detail
router.delete("/:id", async (req, res) => {
  try {
    const detail = await Detail.findByIdAndDelete(req.params.id);
    
    if (!detail) {
      return res.status(404).json({ message: "Detail not found" });
    }
    
    res.json({ message: "Detail deleted successfully" });
  } catch (error) {
    console.error("Error deleting detail:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;