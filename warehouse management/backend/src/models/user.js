const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // Path to profile picture
  notifications: { type: Object, default: {} },
  connectedAccounts: { type: Object, default: {} },
});

module.exports = mongoose.model("User", userSchema);
