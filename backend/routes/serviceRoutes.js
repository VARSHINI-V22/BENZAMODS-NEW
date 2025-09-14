// routes/serviceRoutes.js
import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single service
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new service
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    
    // Validate required fields
    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const service = new Service({
      name,
      category,
      price: parseFloat(price),
      description,
      image
    });
    
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a service
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    // Update service fields
    if (name) service.name = name;
    if (category) service.category = category;
    if (price) service.price = parseFloat(price);
    if (description) service.description = description;
    if (image) service.image = image;
    
    await service.save();
    res.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a service
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;