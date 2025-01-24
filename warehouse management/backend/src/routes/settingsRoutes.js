const express = require("express");
const { getSettings, updateProfile, changePassword, deleteAccount, updateNotifications, updateConnectedAccounts } = require("../controllers/settingsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with authentication middleware
router.use(protect);

// Get user settings
router.get("/", getSettings);

// Update user profile (username, email, profile picture)
router.put("/profile", updateProfile);

// Change password
router.put("/password", changePassword);

// Delete account
router.delete("/delete-account", deleteAccount);

// Update notification preferences
router.put("/notifications", updateNotifications);

// Update connected accounts (e.g., social media accounts)
router.put("/connected-accounts", updateConnectedAccounts);

module.exports = router;
