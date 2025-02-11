const express = require("express");
const Toy = require("../models/toyModel");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get all toys (pagination)
router.get("/", async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const toys = await Toy.find().limit(10).skip(skip);
  res.json(toys);
});

// Add a toy (requires authentication)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const toy = new Toy({ ...req.body, user_id: req.user.id });
    await toy.save();
    res.status(201).json(toy);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a toy (only the owner can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) return res.status(404).json({ error: "Toy not found" });
    if (toy.user_id.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    await toy.deleteOne();
    res.json({ message: "Toy deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;