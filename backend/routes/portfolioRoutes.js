// routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const product = new Product({
      name,
      category,
      price: parseFloat(price),
      description,
      image
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a product
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Update product fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = parseFloat(price);
    if (description) product.description = description;
    if (image) product.image = image;
    
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;