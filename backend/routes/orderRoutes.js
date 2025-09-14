// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import Service from "../models/Service.js";

const router = express.Router();

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate('service');
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('service');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new order
router.post("/", async (req, res) => {
  try {
    const { customer, service, vehicle, appointmentDate } = req.body;
    
    // Validate required fields
    if (!customer || !customer.name || !customer.email || !customer.phone || 
        !service || !vehicle || !appointmentDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Get service details to calculate price
    const serviceDetails = await Service.findById(service);
    if (!serviceDetails) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    const order = new Order({
      customer,
      service,
      vehicle,
      appointmentDate: new Date(appointmentDate),
      totalPrice: serviceDetails.price
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update an order
router.put("/:id", async (req, res) => {
  try {
    const { customer, service, vehicle, status, appointmentDate } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Update order fields
    if (customer) order.customer = customer;
    if (service) order.service = service;
    if (vehicle) order.vehicle = vehicle;
    if (status) order.status = status;
    if (appointmentDate) order.appointmentDate = new Date(appointmentDate);
    
    // Recalculate price if service changed
    if (service && service !== order.service.toString()) {
      const serviceDetails = await Service.findById(service);
      if (serviceDetails) {
        order.totalPrice = serviceDetails.price;
      }
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE an order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;