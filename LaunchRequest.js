const mongoose = require('mongoose');

const launchRequestSchema = new mongoose.Schema({
  submittedBy: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  blockchainId: {
    type: Number,
    required: true, // ✅ This links it to the blockchain index
  },
}, { timestamps: true });

module.exports = mongoose.models.LaunchRequest || mongoose.model('LaunchRequest', launchRequestSchema);
