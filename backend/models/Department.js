const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true           // ✅ avoids extra spaces
  },

  description: {
    type: String,
    default: '',
    trim: true           // ✅ cleaner text
  },

  // ✅ REQUIRED FOR ADMIN DASHBOARD UI (cards, banners)
  image: {
    type: String,
    default: ''          // base64 or URL
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* ✅ INDEX (performance + uniqueness safety) */
departmentSchema.index({ name: 1 });

module.exports = mongoose.model('Department', departmentSchema);
