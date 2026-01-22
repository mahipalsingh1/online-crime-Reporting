const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/* =========================
   REGISTER USER
========================= */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      mobile,
      email,
      username,
      password,
      role,
      image,
      policeId
    } = req.body;

    // ✅ Check email OR username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Normalize role
    const normalizedRole = role.toLowerCase();
    const isApproved = normalizedRole === "police" ? false : true;

    await User.create({
      name,
      dob,
      gender,
      mobile,
      email,
      username,
      password: hashedPassword,
      role: normalizedRole,
      image,
      policeId: normalizedRole === "police" ? policeId : null,
      isApproved
    });

    res.status(201).json({
      message:
        normalizedRole === "police"
          ? "Police registered. Waiting for admin approval."
          : "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error
    });
  }
});

/* =========================
   LOGIN (ADMIN / USER / POLICE)
========================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    /* ================= ADMIN LOGIN ================= */
    if (email === "admin" && password === "Admin@2006") {
      const token = jwt.sign(
        {
          role: "admin",
          username: "admin" // ✅ REQUIRED
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: "admin",
        user: {
          role: "admin",
          username: "admin",
          email: "admin"
        }
      });
    }

    /* ================= USER / POLICE ================= */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // ✅ Police approval check
    if (user.role === "police" && !user.isApproved) {
      return res.status(403).json({
        message: "Police account pending admin approval"
      });
    }

    // 🔐 FIXED JWT (USERNAME INCLUDED)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username // ✅ CRITICAL FIX
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ SEND FULL USER OBJECT
    res.json({
      token,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        dob: user.dob,
        gender: user.gender,
        mobile: user.mobile,
        email: user.email,
        username: user.username,
        role: user.role,
        image: user.image || "",
        policeId: user.policeId || null,
        department: user.department || null
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error
    });
  }
});

module.exports = router;