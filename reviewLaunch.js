const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const getLumosContract = require('../utils/contractLoader');
const LaunchRequest = require('../models/LaunchRequest');

// ✅ Only Regulatory Body can review launch requests
router.post('/', checkRole('Regulatory Body'), async (req, res) => {
  const { id, approve } = req.body;

  if (id === undefined || approve === undefined) {
    return res.status(400).json({ error: 'Missing id or approve (boolean)' });
  }

  try {
    const contract = await getLumosContract();

    // ✅ Step 1: Call smart contract
    const tx = await contract.reviewLaunch(id, approve);
    await tx.wait();

    // ✅ Step 2: Update corresponding MongoDB document using blockchainId
    const updated = await LaunchRequest.findOneAndUpdate(
      { blockchainId: id },
      { status: approve ? 'Approved' : 'Rejected' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'No MongoDB document found for this blockchain ID' });
    }

    res.json({
      message: `🚀 Launch request ${id} ${approve ? 'approved' : 'rejected'} successfully`,
      txHash: tx.hash,
      updated,
    });
  } catch (err) {
    console.error('❌ Error reviewing launch:', err);
    res.status(500).json({ error: 'Review failed', reason: err.message });
  }
});

module.exports = router;
