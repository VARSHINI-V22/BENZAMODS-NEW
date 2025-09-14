import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";
import PortfolioProduct from "../models/PortfolioProduct.js";
import Review from "../models/Review.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Add error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  res.status(400).json({ message: error.message });
});

// GET all portfolio products
router.get("/products", async (req, res) => {
  try {
    const products = await PortfolioProduct.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single portfolio product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await PortfolioProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new portfolio product (Admin only)
router.post("/products", auth, upload.array('images', 5), async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { title, description, price, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const product = new PortfolioProduct({
      title,
      description,
      price: parseFloat(price),
      category,
      images
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a portfolio product (Admin only)
router.put("/products/:id", auth, upload.array('images', 5), async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { title, description, price, category } = req.body;
    const product = await PortfolioProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Update product fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    
    // Add new images if any
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a portfolio product (Admin only)
router.delete("/products/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const product = await PortfolioProduct.findByIdAndDelete(req.params.id);
    
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