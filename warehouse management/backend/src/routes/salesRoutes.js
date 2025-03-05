// routes/salesRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createSale,
  getSalesStats,
  getSalesOverview,
  getSalesByCategory, 
  generateRandomSales,
} = require("../controllers/salesController");

// Create a new sale
router.post("/", protect, createSale);

// Get sales statistics
router.get("/stats", protect, getSalesStats);

// Get sales overview data (time-based)
router.get("/overview", protect, getSalesOverview);

// Get sales breakdown by category
router.get("/by-category", protect, getSalesByCategory);

router.post('/random', protect, generateRandomSales);

module.exports = router;