const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const getLumosContract = require('../utils/contractLoader');
const User = require('../models/User'); // ✅ Mongoose model

// 🧑‍💼 Get all registered users from MongoDB
router.get('/users', checkRole('Admin'), async (req, res) => {
  try {
    const users = await User.find().select('wallet role -_id'); // Clean data (no Mongo _id)
    res.json({ users });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users', reason: err.message });
  }
});

// 🧾 Get all requests (launch + maneuver) from blockchain
router.get('/requests', checkRole('Admin'), async (req, res) => {
  try {
    const contract = await getLumosContract();

    const launches = await contract.getLaunchRequests();
    const maneuvers = await contract.getManeuverRequests();

    const mapStatus = (s) => ['Pending', 'Approved', 'Rejected'][s];

    const launchFormatted = launches.map((r, i) => ({
      id: i,
      type: 'Launch',
      submittedBy: r.submittedBy,
      details: r.details,
      status: mapStatus(Number(r.status)),
    }));

    const maneuverFormatted = maneuvers.map((r, i) => ({
      id: i,
      type: 'Maneuver',
      submittedBy: r.submittedBy,
      details: r.details,
      status: mapStatus(Number(r.status)),
    }));

    res.json({
      allRequests: [...launchFormatted, ...maneuverFormatted],
    });
  } catch (err) {
    console.error('❌ Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch requests', reason: err.message });
  }
});

module.exports = router;
