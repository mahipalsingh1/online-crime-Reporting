const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");

// 🔐 MIDDLEWARES
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

/**
 * ================================
 * 1️⃣ Register a new complaint
 * ================================
 * POST /complaints/register
 * 🔐 PUBLIC ONLY
 */
router.post(
  "/register",
  authMiddleware,
  roleMiddleware("public"),
  async (req, res) => {
    try {
      // ✅ SANITIZE INPUT
      const {
        name,
        location,
        crimeType,
        ipcSection,
        detail,
        evidence,
        date,
        mobile
      } = req.body;

      const complaint = new Complaint({
        name,
        location,
        crimeType,
        ipcSection,
        detail,
        evidence,
        date,
        mobile,

        // 🔒 SECURE FIELDS
        username: req.user.username,
        userId: req.user.id,          // ✅ FIX: STORE USER ID
        status: "Pending"
      });

      await complaint.save();

      /* 🔔 NOTIFICATION: Complaint Registered */
      await Notification.create({
        userId: req.user.id,
        title: "Complaint Registered",
        message: `Your complaint for "${crimeType}" has been registered successfully.`,
        type: "complaint"
      });

      res.status(201).json({
        message: "Complaint Registered Successfully",
        complaint
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Error registering complaint",
        error: err.message
      });
    }
  }
);

/**
 * ================================
 * 2️⃣ Get all complaints
 * ================================
 * GET /complaints/view
 * 🔐 POLICE + ADMIN ONLY
 */
router.get(
  "/view",
  authMiddleware,
  roleMiddleware("police", "admin"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      res.status(200).json(complaints);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error fetching complaints"
      });
    }
  }
);

/**
 * ==========================================
 * 3️⃣ Get complaints of logged-in public user
 * ==========================================
 * GET /complaints/user/:username
 * 🔐 PUBLIC ONLY
 */
router.get(
  "/user/:username",
  authMiddleware,
  roleMiddleware("public"),
  async (req, res) => {
    try {
      // 🔒 EXTRA SAFETY
      if (req.params.username !== req.user.username) {
        return res.status(403).json({
          message: "Unauthorized access"
        });
      }

      const complaints = await Complaint.find({
        username: req.user.username
      }).sort({ createdAt: -1 });

      res.status(200).json(complaints);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error fetching user complaints"
      });
    }
  }
);

/**
 * ==========================================
 * 4️⃣ Update complaint status
 * ==========================================
 * PUT /complaints/update/:id
 * 🔐 POLICE + ADMIN
 */
router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware("police", "admin"),
  async (req, res) => {
    try {
      const updatePayload = {
        status: req.body.status,
        officer: req.body.officer,
        remarks: req.body.remarks
      };

      const updatedComplaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        updatePayload,
        { new: true }
      );

      if (!updatedComplaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }

      /* 🔔 NOTIFICATION: Status Updated */
      await Notification.create({
        userId: updatedComplaint.userId,   // ✅ FIX: ALWAYS ORIGINAL USER
        title: "Complaint Status Updated",
        message: `Your complaint status is now "${updatedComplaint.status}".`,
        type: "complaint"
      });

      res.status(200).json({
        message: "Complaint updated successfully",
        updatedComplaint
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Error updating complaint"
      });
    }
  }
);

module.exports = router;