const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: String,
  text: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
