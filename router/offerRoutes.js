// routes/offerRoutes.js
const express = require("express");
const router = express.Router();
const {
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

const { authenticateToken, isAdmin } = require("../Middleware/authMiddleware");

// User can read active offer
router.get("/", getOffer);

// Admin CRUD
router.post("/", authenticateToken, isAdmin, createOffer);
router.put("/:id",  authenticateToken, isAdmin, updateOffer);
router.delete("/:id",  authenticateToken, isAdmin, deleteOffer);

module.exports = router;
