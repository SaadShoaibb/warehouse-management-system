const express = require("express");
const { register,login } = require ("../controllers/authcontroller");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, (req, res) => {
    res.status(200).json({ message: "Logout successful" });
  });  
module.exports = router;