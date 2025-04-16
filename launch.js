const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const getLumosContract = require('../utils/contractLoader');
const LaunchRequest = require('../models/LaunchRequest');

// 🚀 Submit a launch request (Only General Users)
router.post('/', checkRole('General User'), async (req, res) => {
  const { details } = req.body;

  if (!details) {
    return res.status(400).json({ error: 'Missing launch request details' });
  }

  try {
    const contract = await getLumosContract();
    const tx = await contract.requestLaunch(details);
    await tx.wait();

    // ✅ Get latest index on-chain (assumes newest request)
    const allRequests = await contract.getLaunchRequests();
    const blockchainId = allRequests.length - 1;

    // ✅ Store to MongoDB
    const mongoEntry = new LaunchRequest({
      submittedBy: req.wallet, // populated from checkRole middleware
      details,
      status: 'Pending',
      blockchainId,
    });

    await mongoEntry.save();

    res.json({
      message: '🚀 Launch request submitted successfully!',
      txHash: tx.hash,
      blockchainId,
    });
  } catch (err) {
    console.error('❌ Error in /api/launch (POST):', err);
    res.status(500).json({ error: 'Launch request failed', reason: err.message });
  }
});

// 📥 Fetch all launch requests (Persistent via MongoDB)
router.get('/', async (req, res) => {
  try {
    const launches = await LaunchRequest.find().sort({ createdAt: -1 });

    const formatted = launches.map((r, i) => ({
      id: r.blockchainId ?? i,
      submittedBy: r.submittedBy,
      details: r.details,
      status: r.status,
    }));

    res.json({ launches: formatted });
  } catch (err) {
    console.error('❌ Error in /api/launch (GET):', err);
    res.status(500).json({ error: 'Failed to fetch launch history', reason: err.message });
  }
});

module.exports = router;
