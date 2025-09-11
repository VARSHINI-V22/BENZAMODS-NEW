const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerName
 *         - customerEmail
 *         - products
 *         - totalAmount
 *         - shippingAddress
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the order
 *         customerName:
 *           type: string
 *           description: Name of the customer
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: Email address of the customer
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *         totalAmount:
 *           type: number
 *           description: Total amount of the order
 *         status:
 *           type: string
 *           enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"]
 *           default: "pending"
 *           description: Status of the order
 *         shippingAddress:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the order was last updated
 *       example:
 *         _id: 60d5f4a9e6b8a425f4c7f9a1
 *         customerName: John Doe
 *         customerEmail: john@example.com
 *         products:
 *           - productId: 60d5f4a9e6b8a425f4c7f9a2
 *             quantity: 2
 *             price: 29.99
 *         totalAmount: 59.98
 *         status: "pending"
 *         shippingAddress:
 *           street: "123 Main St"
 *           city: "New York"
 *           state: "NY"
 *           zipCode: "10001"
 *           country: "USA"
 *         createdAt: 2023-06-28T10:00:00.000Z
 *         updatedAt: 2023-06-28T10:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

// Helper function to clean and validate ObjectId
const cleanObjectId = (id) => {
  // Remove any surrounding quotes
  let cleanedId = id.replace(/^"+|"+$/g, '');
  
  // Validate if it's a proper ObjectId
  if (mongoose.Types.ObjectId.isValid(cleanedId)) {
    return cleanedId;
  }
  
  throw new Error('Invalid ObjectId format');
};

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *           example:
 *             customerName: John Doe
 *             customerEmail: john@example.com
 *             products:
 *               - productId: 60d5f4a9e6b8a425f4c7f9a2
 *                 quantity: 2
 *                 price: 29.99
 *             totalAmount: 59.98
 *             shippingAddress:
 *               street: "123 Main St"
 *               city: "New York"
 *               state: "NY"
 *               zipCode: "10001"
 *               country: "USA"
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed: customerName is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.post("/", async (req, res) => {
  try {
    console.log("📦 Incoming Order:", req.body);
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order Save Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/", async (req, res) => {
  try {
    // Admin authentication
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    // Build filter query
    let filterQuery = {};
    if (status) {
      filterQuery.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get orders with filter and pagination
    const orders = await Order.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination info
    const total = await Order.countDocuments(filterQuery);
    
    res.json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("❌ GET Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: 60d5f4a9e6b8a425f4c7f9a2
 *         description: |
 *           Valid MongoDB ObjectId of the order.
 *           Example - 60d5f4a9e6b8a425f4c7f9a2
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid order ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid order ID format"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/:id", async (req, res) => {
  try {
    console.log("📦 Received ID:", req.params.id);
    
    // Clean and validate the ID
    const cleanedId = cleanObjectId(req.params.id);
    console.log("📦 Cleaned ID:", cleanedId);
    
    const order = await Order.findById(cleanedId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("❌ GET Order Error:", err.message);
    
    if (err.message === 'Invalid ObjectId format') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: 60d5f4a9e6b8a425f4c7f9a2
 *         description: |
 *           Valid MongoDB ObjectId of the order.
 *           Example - 60d5f4a9e6b8a425f4c7f9a2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.put("/:id", async (req, res) => {
  try {
    // Clean and validate the ID
    const cleanedId = cleanObjectId(req.params.id);
    
    // Admin authentication
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const order = await Order.findByIdAndUpdate(
      cleanedId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    console.error("❌ PUT Order Error:", err.message);
    
    if (err.message === 'Invalid ObjectId format') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *           example: 60d5f4a9e6b8a425f4c7f9a2
 *         description: |
 *           Valid MongoDB ObjectId of the order.
 *           Example - 60d5f4a9e6b8a425f4c7f9a2
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing admin token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Order not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
router.delete("/:id", async (req, res) => {
  try {
    // Clean and validate the ID
    const cleanedId = cleanObjectId(req.params.id);
    
    // Admin authentication
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const order = await Order.findByIdAndDelete(cleanedId);
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE Order Error:", err.message);
    
    if (err.message === 'Invalid ObjectId format') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;