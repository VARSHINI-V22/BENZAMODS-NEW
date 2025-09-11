const express = require("express");
const Detail = require("../models/Detail");
const router = express.Router();

// Get details by modificationId
router.get("/:modificationId", async (req, res) => {
  try {
    const details = await Detail.find({ modificationId: req.params.modificationId });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
