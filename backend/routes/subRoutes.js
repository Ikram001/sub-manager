import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const subs = await Subscription.find();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSub = new Subscription(req.body);
    const savedSub = await newSub.save();
    res.status(201).json(savedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSub = await Subscription.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSub) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updatedSub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
