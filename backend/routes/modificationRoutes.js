import express from "express";
import Modification from "../models/Modification.js";
const router = express.Router();

// GET all modifications
router.get("/", async (req, res) => {
  try {
    const modifications = await Modification.find();
    res.json(modifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single modification
router.get("/:id", async (req, res) => {
  try {
    const modification = await Modification.findById(req.params.id);
    if (!modification) {
      return res.status(404).json({ message: "Modification not found" });
    }
    res.json(modification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new modification
router.post("/", async (req, res) => {
  try {
    const modification = new Modification(req.body);
    await modification.save();
    res.status(201).json(modification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a modification
router.put("/:id", async (req, res) => {
  try {
    const updated = await Modification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Modification not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a modification
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Modification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Modification not found" });
    }
    res.json({ message: "Modification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;