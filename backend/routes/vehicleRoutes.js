
const express = require("express");
const router = express.Router();
const VehicleService = require("../models/VehicleService");

// Get all services by type (car or bike)
router.get("/:type", async (req, res) => {
  try {
    const services = await VehicleService.find({ type: req.params.type });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single service by name and ID
router.get("/:name/:id", async (req, res) => {
  try {
    const service = await VehicleService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;