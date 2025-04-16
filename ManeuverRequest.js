const mongoose = require('mongoose');

const maneuverRequestSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    required: true,
  },
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
}, { timestamps: true });

module.exports = mongoose.models.ManeuverRequest || mongoose.model('ManeuverRequest', maneuverRequestSchema);
