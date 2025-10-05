// models/Offer.js
const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", OfferSchema);
