const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    // Public User Details
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },               // optional but useful
    username: { type: String, required: true },

    // Complaint Details
    location: { type: String, required: true },
    crimeType: { type: String, required: true },
    ipcSection: { type: String, required: true },
    detail: { type: String, required: true },
    evidence: { type: String },
    date: { type: Date, required: true },

    // Police Side Fields
    status: {
      type: String,
      enum: ['Pending', 'Under Investigation', 'Solved', 'Invalid'],
      default: 'Pending'
    },

    officer: {
      type: String,
      default: ''
    },

    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);