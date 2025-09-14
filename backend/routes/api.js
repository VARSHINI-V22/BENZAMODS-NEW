const express = require('express');
const router = express.Router();

// Service Model
const Service = require('../models/Service');

// GET all services
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new service
router.post('/services', async (req, res) => {
  const service = new Service({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific service
router.get('/services/:id', getService, (req, res) => {
  res.json(res.service);
});

// PUT/update a service
router.put('/services/:id', getService, async (req, res) => {
  if (req.body.name != null) {
    res.service.name = req.body.name;
  }
  if (req.body.category != null) {
    res.service.category = req.body.category;
  }
  if (req.body.price != null) {
    res.service.price = req.body.price;
  }
  if (req.body.description != null) {
    res.service.description = req.body.description;
  }
  if (req.body.image != null) {
    res.service.image = req.body.image;
  }

  try {
    const updatedService = await res.service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a service
router.delete('/services/:id', getService, async (req, res) => {
  try {
    await res.service.remove();
    res.json({ message: 'Deleted service' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get service by ID
async function getService(req, res, next) {
  let service;
  try {
    service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Cannot find service' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.service = service;
  next();
}

module.exports = router;