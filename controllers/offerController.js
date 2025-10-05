// controllers/offerController.js
const Offer = require("../models/Offer");

// USER: Get active offer
const getOffer = async (req, res) => {
  try {
    const offer = await Offer.findOne({ isActive: true });
    if (!offer) {
      return res.status(404).json({ message: "No active offer found" });
    }
    res.status(200).json({ offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Create new offer
const createOffer = async (req, res) => {
  try {
    const { text, isActive } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const offer = await Offer.create({ text, isActive });
    res.status(201).json({ message: "Offer created", offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Update offer
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isActive } = req.body;

    const offer = await Offer.findByIdAndUpdate(
      id,
      { text, isActive },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer updated", offer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: Delete offer
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOffer, createOffer, updateOffer, deleteOffer };
