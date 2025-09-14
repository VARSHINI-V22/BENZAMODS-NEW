// routes/categoryRoutes.js
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const category = new Category({
      name,
      description
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a category
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    // Update category fields
    if (name) category.name = name;
    if (description) category.description = description;
    
    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;