const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const getLumosContract = require('../utils/contractLoader');
const ManeuverRequest = require('../models/ManeuverRequest');

// 🔧 Submit a maneuver request (Only General Users)
router.post('/', checkRole('General User'), async (req, res) => {
  const { details } = req.body;

  if (!details) {
    return res.status(400).json({ error: 'Missing maneuver request details' });
  }

  if (!req.wallet) {
    console.error('❌ Missing req.wallet in maneuver request');
    return res.status(400).json({ error: 'Wallet address missing from request context' });
  }

  try {
    const contract = await getLumosContract();

    const tx = await contract.requestManeuver(details);
    await tx.wait();

    // 🧠 Fetch last request for status + index
    const allManeuvers = await contract.getManeuverRequests();
    const lastIndex = allManeuvers.length - 1;
    const last = allManeuvers[lastIndex];

    const mongoEntry = new ManeuverRequest({
      blockchainId: lastIndex, // ✅ Link to blockchain ID
      submittedBy: req.wallet,
      details,
      status: ['Pending', 'Approved', 'Rejected'][Number(last.status)],
    });

    await mongoEntry.save();

    res.json({
      message: '🔧 Maneuver request submitted successfully!',
      txHash: tx.hash,
      blockchainId: lastIndex,
    });
  } catch (err) {
    console.error('❌ Error in /api/maneuver (POST):', err);
    res.status(500).json({ error: 'Maneuver request failed', reason: err.message });
  }
});

// 📥 Fetch all maneuver requests (Persistent via MongoDB)
router.get('/', async (req, res) => {
  try {
    const maneuvers = await ManeuverRequest.find().sort({ createdAt: -1 });

    const formatted = maneuvers.map((r, i) => ({
      id: r.blockchainId ?? i,
      submittedBy: r.submittedBy,
      details: r.details,
      status: r.status,
    }));

    res.json({ maneuvers: formatted });
  } catch (err) {
    console.error('❌ Error in /api/maneuver (GET):', err);
    res.status(500).json({ error: 'Failed to fetch maneuver history', reason: err.message });
  }
});

module.exports = router;
