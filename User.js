const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Regulatory Body', 'General User'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
