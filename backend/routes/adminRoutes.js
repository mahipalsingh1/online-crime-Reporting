const express = require('express');
const User = require('../models/User');
const Department = require('../models/Department');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/* =========================
   🔐 ADMIN ROLE CHECK
========================= */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

/* =========================
   ADMIN: GET ALL USERS
========================= */
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/* =========================
   ADMIN: DELETE USER
   (PUBLIC / APPROVED POLICE)
========================= */
router.delete('/delete-user/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({
        message: "Admin account cannot be deleted"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

/* =========================
   ADMIN: GET PENDING POLICE
========================= */
router.get('/pending-police', authMiddleware, adminOnly, async (req, res) => {
  try {
    const police = await User.find({
      role: 'police',
      isApproved: false
    }).select('-password');

    res.json(police);
  } catch {
    res.status(500).json({ message: "Failed to fetch pending police" });
  }
});

/* =========================
   ADMIN: APPROVE POLICE
========================= */
router.put('/approve-police/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isApproved: true
    });

    res.json({ message: "Police approved successfully" });
  } catch {
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =========================
   ADMIN: REJECT POLICE ❗ (NEW)
   → Delete unapproved police
========================= */
router.delete('/reject-police/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const police = await User.findById(req.params.id);

    if (!police) {
      return res.status(404).json({ message: "Police not found" });
    }

    if (police.role !== 'police' || police.isApproved) {
      return res.status(400).json({
        message: "Only pending police can be rejected"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Police rejected successfully" });
  } catch {
    res.status(500).json({ message: "Failed to reject police" });
  }
});

/* =========================
   ADMIN: ASSIGN DEPARTMENT
========================= */
router.put('/assign-department/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { department } = req.body;

    await User.findByIdAndUpdate(req.params.id, { department });

    res.json({ message: "Department assigned successfully" });
  } catch {
    res.status(500).json({ message: "Department assignment failed" });
  }
});

/* =========================
   ADMIN: CREATE DEPARTMENT
========================= */
router.post('/department', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const dept = await Department.create({
      name,
      description,
      image
    });

    res.status(201).json(dept);
  } catch {
    res.status(400).json({ message: "Department already exists" });
  }
});

/* =========================
   ADMIN: GET ALL DEPARTMENTS
========================= */
router.get('/departments', authMiddleware, adminOnly, async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch {
    res.status(500).json({ message: "Failed to fetch departments" });
  }
});

module.exports = router;