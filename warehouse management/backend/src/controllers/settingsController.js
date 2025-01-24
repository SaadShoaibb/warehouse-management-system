const User = require("../models/user");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
};

// Update notifications
exports.updateNotifications = async (req, res) => {
  try {
    const { notifications } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { notifications }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications." });
  }
};

// Update connected accounts
exports.updateConnectedAccounts = async (req, res) => {
  try {
    const { connectedAccounts } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { connectedAccounts }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update connected accounts." });
  }
};

// Update profile
exports.updateProfile = [
  upload.single("profilePicture"), // Middleware to handle image upload
  async (req, res) => {
    try {
      const { username, email } = req.body;
      const updates = { username, email };

      // If a profile picture is uploaded, update the profilePicture field
      if (req.file) {
        updates.profilePicture = `/uploads/profile_pictures/${req.file.filename}`;
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile." });
    }
  },
];

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect current password." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to change password." });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account." });
  }
};
