const express = require('express');
const router = express.Router();
const getLumosContract = require('../utils/contractLoader');

// 🛰️ Submit maneuver request
router.post('/', async (req, res) => {
  const { details } = req.body;

  if (!details) {
    return res.status(400).json({ error: 'Missing maneuver request details' });
  }

  try {
    const contract = await getLumosContract();
    const tx = await contract.requestManeuver(details);
    await tx.wait();

    res.json({
      message: '🔧 Maneuver request submitted successfully!',
      txHash: tx.hash,
    });
  } catch (err) {
    console.error('❌ Error in /api/maneuver (POST):', err);
    res.status(500).json({ error: 'Maneuver request failed', reason: err.message });
  }
});

// 📥 Get all maneuver requests
router.get('/', async (req, res) => {
  try {
    const contract = await getLumosContract();
    const requests = await contract.getManeuverRequests();

    // Format the result
    const formatted = requests.map((r, i) => ({
      id: i,
      submittedBy: r.submittedBy,
      details: r.details,
      status: ['Pending', 'Approved', 'Rejected'][r.status],
    }));

    res.json({ maneuvers: formatted });
  } catch (err) {
    console.error('❌ Error in /api/maneuver (GET):', err);
    res.status(500).json({ error: 'Failed to fetch maneuver history', reason: err.message });
  }
});

module.exports = router;
