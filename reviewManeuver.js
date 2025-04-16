const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const getLumosContract = require('../utils/contractLoader');
const ManeuverRequest = require('../models/ManeuverRequest');

// ✅ Only Regulatory Body can review maneuvers
router.post('/', checkRole('Regulatory Body'), async (req, res) => {
  const { id, approve } = req.body;

  if (id === undefined || approve === undefined) {
    return res.status(400).json({ error: 'Missing id or approve (boolean)' });
  }

  try {
    const contract = await getLumosContract();
    const maneuvers = await contract.getManeuverRequests();

    if (id >= maneuvers.length) {
      return res.status(404).json({ error: 'Maneuver request not found' });
    }

    const currentStatus = Number(maneuvers[id].status); // 0 = Pending, 1 = Approved, 2 = Rejected
    if (currentStatus !== 0) {
      return res.status(400).json({
        error: 'This maneuver request has already been reviewed.',
        currentStatus: ['Pending', 'Approved', 'Rejected'][currentStatus],
      });
    }

    // ⛓️ Update on-chain
    const tx = await contract.reviewManeuver(id, approve);
    await tx.wait();

    // 🧠 Update MongoDB using blockchainId instead of _id
    const updated = await ManeuverRequest.findOneAndUpdate(
      { blockchainId: id },
      { status: approve ? 'Approved' : 'Rejected' },
      { new: true }
    );

    res.json({
      message: `✅ Maneuver request ${id} ${approve ? 'approved' : 'rejected'} successfully`,
      txHash: tx.hash,
      db: updated,
    });
  } catch (err) {
    console.error('❌ Error reviewing maneuver:', err);
    res.status(500).json({ error: 'Review failed', reason: err.message });
  }
});

module.exports = router;
