const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  // ✅ REQUIRED FOR LOGIN / PROFILE / COMPLAINT FILTERING
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true   // ✅ prevents duplicate like User / user
  },

  dob: {
    type: Date,
    required: true
  },

  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'] // ✅ safer validation
  },

  mobile: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // ✅ avoids duplicate EMAIL@gmail.com
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['public', 'police', 'admin'],
    required: true
  },

  // ✅ REQUIRED FOR POLICE VALIDATION
  policeId: {
    type: String,
    default: null
  },

  // ✅ REQUIRED FOR PROFILE IMAGE
  image: {
    type: String,
    default: ''
  },

  // 🔹 Police approval by Admin
  isApproved: {
    type: Boolean,
    default: function () {
      return this.role === 'public';
    }
  },

  // 🔹 Department assigned by Admin
  department: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* ✅ INDEXES (IMPORTANT FOR PERFORMANCE & DUPLICATES) */
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
