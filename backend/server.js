const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaints');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

/* =========================
   🔐 MIDDLEWARES
========================= */

// ✅ CORS (allow Authorization header)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ BODY SIZE (for base64 images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* =========================
   🔗 DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =========================
   🚏 ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================
   🚨 GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error"
  });
});

/* =========================
   🚀 SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
