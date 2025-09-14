// routes/location.js
import express from "express";
import Location from "../models/Location.js";

const router = express.Router();

// GET all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET a single location
router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST create a new location
router.post("/", async (req, res) => {
  try {
    const { name, address, phone, email, coordinates } = req.body;
    
    // Validate required fields
    if (!name || !address || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const location = new Location({
      name,
      address,
      phone,
      email,
      coordinates
    });
    
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update a location
router.put("/:id", async (req, res) => {
  try {
    const { name, address, phone, email, coordinates } = req.body;
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    
    // Update location fields
    if (name) location.name = name;
    if (address) location.address = address;
    if (phone) location.phone = phone;
    if (email) location.email = email;
    if (coordinates) location.coordinates = coordinates;
    
    await location.save();
    res.json(location);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a location
router.delete("/:id", async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;