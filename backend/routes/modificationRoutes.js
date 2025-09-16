const express = require("express");
const Modification = require("../models/Modification");
const router = express.Router();

// Get modifications by categoryId
router.get("/:categoryId", async (req, res) => {
  try {
    const mods = await Modification.find({ categoryId: req.params.categoryId });
    res.json(mods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;