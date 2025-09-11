const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const PortfolioProduct = require("../models/PortfolioProduct");
const Review = require("../models/Review");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
/**
 * @swagger
 * /api/portfolio/products:
 *   get:
 *     summary: Get all portfolio products
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: List of portfolio products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PortfolioProduct'
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/portfolio/products/{id}:
 *   get:
 *     summary: Get a single portfolio product
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PortfolioProduct'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/portfolio/products:
 *   post:
 *     summary: Create a new portfolio product (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product
 *               description:
 *                 type: string
 *                 description: Description of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               category:
 *                 type: string
 *                 description: Category of the product
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of product images
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PortfolioProduct'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/portfolio/products/{id}:
 *   put:
 *     summary: Update a portfolio product (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the product
 *               description:
 *                 type: string
 *                 description: Description of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *               category:
 *                 type: string
 *                 description: Category of the product
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of product images
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PortfolioProduct'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /api/portfolio/products/{id}:
 *   delete:
 *     summary: Delete a portfolio product (Admin only)
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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

// Cart operations

/**
 * @swagger
 * /api/portfolio/cart:
 *   post:
 *     summary: Add a product to cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to cart
 *               quantity:
 *                 type: number
 *                 description: "Quantity of the product to add (default: 1)"
 *     responses:
 *       200:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/cart", auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists
    const product = await PortfolioProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if product already in cart
    const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    
    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }
    
    await user.save();
    
    // Populate cart with product details before sending response
    await user.populate('cart.productId');
    res.json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update in cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: New quantity for the product
 *     responses:
 *       200:
 *         description: Cart item updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
router.put("/cart/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    
    const cartItem = user.cart.find(item => item.productId.toString() === req.params.productId);
    
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    
    cartItem.quantity = quantity;
    await user.save();
    
    await user.populate('cart.productId');
    res.json({ message: "Cart item updated", cart: user.cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/cart/{productId}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from cart
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
    await user.save();
    
    await user.populate('cart.productId');
    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: error.message });
  }
});

// Wishlist operations

/**
 * @swagger
 * /api/portfolio/wishlist:
 *   post:
 *     summary: Add a product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to wishlist
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/wishlist", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await PortfolioProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    
    await user.populate('wishlist');
    res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/wishlist/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    
    await user.populate('wishlist');
    res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: error.message });
  }
});

// Review operations

/**
 * @swagger
 * /api/portfolio/reviews:
 *   post:
 *     summary: Submit a review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product being reviewed
 *               rating:
 *                 type: number
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               beforeImage:
 *                 type: string
 *                 format: binary
 *                 description: Before image (optional)
 *               afterImage:
 *                 type: string
 *                 format: binary
 *                 description: After image (optional)
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/reviews", auth, upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Check if product exists
    const product = await PortfolioProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const user = await User.findById(req.user.id);
    
    const review = new Review({
      productId,
      userId: req.user.id,
      userName: user.name,
      rating: parseInt(rating),
      comment,
      beforeImage: req.files && req.files.beforeImage ? `/uploads/${req.files.beforeImage[0].filename}` : null,
      afterImage: req.files && req.files.afterImage ? `/uploads/${req.files.afterImage[0].filename}` : null,
      status: "pending"
    });
    
    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/reviews/{productId}:
 *   get:
 *     summary: Get approved reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: List of approved reviews
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get("/reviews/:productId", async (req, res) => {
  try {
    // Check if product exists
    const product = await PortfolioProduct.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const reviews = await Review.find({ 
      productId: req.params.productId, 
      status: "approved" 
    }).sort({ date: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/reviews:
 *   get:
 *     summary: Get all reviews (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/reviews", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const reviews = await Review.find().populate("productId", "title");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/portfolio/reviews/{id}:
 *   put:
 *     summary: Update review status (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["pending", "approved", "rejected"]
 *                 description: New status for the review
 *     responses:
 *       200:
 *         description: Review status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/reviews/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    res.json({ message: "Review status updated", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;