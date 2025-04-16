const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Mongoose model
const getLumosContract = require('../utils/contractLoader');

// 👤 POST /api/register
router.post('/', async (req, res) => {
  const { wallet, role } = req.body;

  if (!wallet || !role) {
    return res.status(400).json({ error: 'Missing wallet or role' });
  }

  if (!wallet.startsWith('0x') || wallet.length !== 42) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  const validRoles = ['Admin', 'Regulatory Body', 'General User'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role value' });
  }

  try {
    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ wallet });
    if (existingUser) {
      return res.status(409).json({ error: 'User already registered' });
    }

    // (Optional) Store to blockchain as well
    const contract = await getLumosContract();
    const tx = await contract.registerSelf(validRoles.indexOf(role) + 1);
    await tx.wait();

    // Store to MongoDB
    const newUser = new User({ wallet, role });
    await newUser.save();

    res.json({
      message: '✅ User registered successfully',
      role,
      wallet,
      txHash: tx.hash,
    });
  } catch (err) {
    console.error('❌ Error in /api/register:', err);
    res.status(500).json({ error: 'Registration failed', reason: err.message });
  }
});

module.exports = router;
