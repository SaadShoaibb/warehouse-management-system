const express = require("express");
const { addOrder, getOrders } = require("../controllers/orderController");
const router = express.Router();
router.post("/orders", addOrder);
router.get("/orders", getOrders);
module.exports = router;