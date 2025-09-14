// routes/modificationRoutes.js
import express from "express";
import Modification from "../models/Modification.js";

const router = express.Router();

// GET all modifications
router.get("/", async (req, res) => {
  try {
    const modifications = await Modification.find();
    res.json(modifications);
  } catch (error) {
    console.error("Error fetching modifications:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single modification
router.get("/:id", async (req, res) => {
  try {
    const modification = await Modification.findById(req.params.id);
    if (!modification) {
      return res.status(404).json({ message: "Modification not found" });
    }
    res.json(modification);
  } catch (error) {
    console.error("Error fetching modification:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new modification
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const modification = new Modification({
      name,
      category,
      price: parseFloat(price),
      description,
      image
    });
    
    await modification.save();
    res.status(201).json(modification);
  } catch (error) {
    console.error("Error creating modification:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a modification
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const modification = await Modification.findById(req.params.id);
    
    if (!modification) {
      return res.status(404).json({ message: "Modification not found" });
    }
    
    // Update modification fields
    if (name) modification.name = name;
    if (category) modification.category = category;
    if (price) modification.price = parseFloat(price);
    if (description) modification.description = description;
    if (image) modification.image = image;
    
    await modification.save();
    res.json(modification);
  } catch (error) {
    console.error("Error updating modification:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a modification
router.delete("/:id", async (req, res) => {
  try {
    const modification = await Modification.findByIdAndDelete(req.params.id);
    
    if (!modification) {
      return res.status(404).json({ message: "Modification not found" });
    }
    
    res.json({ message: "Modification deleted successfully" });
  } catch (error) {
    console.error("Error deleting modification:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;