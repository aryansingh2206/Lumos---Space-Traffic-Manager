const express = require('express');
const router = express.Router();
const getLumosContract = require('../utils/contractLoader');
const User = require('../models/User'); // ✅ MongoDB model

// 🧠 GET /api/role/:wallet
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;

  if (!wallet || wallet.length !== 42 || !wallet.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const contract = await getLumosContract();
    const roleId = await contract.roles(wallet);

    const roleMap = {
      0: 'None',
      1: 'Admin',
      2: 'Regulatory Body',
      3: 'General User',
    };

    const role = roleMap[Number(roleId)] || 'Unknown';

    // ✅ Store in MongoDB (or update if already exists)
    if (role !== 'None' && role !== 'Unknown') {
      await User.findOneAndUpdate(
        { wallet },
        { wallet, role },
        { upsert: true, new: true }
      );
    }

    res.json({
      wallet,
      role,
      roleId: Number(roleId),
    });
  } catch (err) {
    console.error('❌ Error in /api/role/:wallet:', err);
    res.status(500).json({ error: 'Failed to fetch role', reason: err.message });
  }
});

module.exports = router;
