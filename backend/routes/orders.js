// routes/orders.js
import express from "express";
import Order from "../models/Order.js";
import { orderSchema } from "../utils/validateOrder.js";

const router = express.Router();

// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Order:", req.body);
    
    // Validate the request body
    const { error, value } = orderSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({ 
        ok: false, 
        errors: error.details.map(d => d.message) 
      });
    }

    // Map shippingAddress to customerAddress for the model
    const orderData = {
      ...value,
      customerAddress: value.shippingAddress
    };
    
    // Remove the shippingAddress field as it's not in the model
    delete orderData.shippingAddress;

    // Save the order to the database
    const order = await Order.create(orderData);
    
    console.log("Order saved successfully:", order._id);
    
    // Here you would typically:
    // 1. Process payment
    // 2. Send confirmation email
    // 3. Update inventory, etc.
    
    return res.status(201).json({ 
      ok: true, 
      message: "Order created successfully",
      data: order 
    });
  } catch (err) {
    console.error("Order Save Error:", err);
    return res.status(500).json({ 
      ok: false, 
      message: "Server error while creating order" 
    });
  }
});

// GET /api/orders - Get all orders (admin only)
router.get("/", async (req, res) => {
  try {
    const token = req.headers["x-admin-token"];
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("products.productId");
    
    const total = await Order.countDocuments();
    
    res.json({ 
      ok: true, 
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Other order routes (get by ID, update, delete) would go here...

export default router;