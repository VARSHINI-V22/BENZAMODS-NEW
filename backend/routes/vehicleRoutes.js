// routes/vehicleRoutes.js
import express from "express";
import Vehicle from "../models/Vehicle.js";
import Service from "../models/Service.js";

const router = express.Router();

// GET all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('services');
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single vehicle
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('services');
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new vehicle
router.post("/", async (req, res) => {
  try {
    const { name, type, services, price } = req.body;
    
    // Validate required fields
    if (!name || !type || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const vehicle = new Vehicle({
      name,
      type,
      services: services || [],
      price: parseFloat(price)
    });
    
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a vehicle
router.put("/:id", async (req, res) => {
  try {
    const { name, type, services, price } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    // Update vehicle fields
    if (name) vehicle.name = name;
    if (type) vehicle.type = type;
    if (services) vehicle.services = services;
    if (price) vehicle.price = parseFloat(price);
    
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a vehicle
router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;