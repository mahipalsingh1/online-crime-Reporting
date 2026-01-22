const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// 🔐 MIDDLEWARES
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/* ======================================
   1️⃣ GET NOTIFICATIONS (LOGGED-IN USER)
====================================== */
/*
   GET /notifications
   🔐 PUBLIC / POLICE / ADMIN
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      username: req.user.username
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
});

/* ======================================
   2️⃣ CREATE NOTIFICATION (SYSTEM / ADMIN / POLICE)
====================================== */
/*
   POST /notifications
   🔐 ADMIN + POLICE
*/
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "police"),
  async (req, res) => {
    try {
      const { username, title, message, type } = req.body;

      if (!username || !title || !message) {
        return res.status(400).json({
          message: "Required fields missing"
        });
      }

      const notification = await Notification.create({
        username,
        title,
        message,
        type: type || "info"
      });

      res.status(201).json({
        message: "Notification sent successfully",
        notification
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to create notification"
      });
    }
  }
);

/* ======================================
   3️⃣ MARK NOTIFICATION AS READ
====================================== */
/*
   PUT /notifications/read/:id
   🔐 OWNER ONLY
*/
router.put("/read/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    // 🔒 Ensure owner only
    if (notification.username !== req.user.username) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      message: "Notification marked as read"
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update notification"
    });
  }
});

/* ======================================
   4️⃣ CLEAR ALL NOTIFICATIONS (USER)
====================================== */
/*
   DELETE /notifications/clear
   🔐 USER
*/
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({
      username: req.user.username
    });

    res.json({
      message: "All notifications cleared"
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to clear notifications"
    });
  }
});

module.exports = router;