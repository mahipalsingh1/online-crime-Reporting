const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true // 🔒 owner of notification
  },

  message: {
    type: String,
    required: true
  },

  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notification", notificationSchema);