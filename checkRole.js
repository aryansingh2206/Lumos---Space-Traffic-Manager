const getLumosContract = require('../utils/contractLoader');

const roleMap = {
  Admin: 1,
  'Regulatory Body': 2,
  'General User': 3,
};

// Middleware: checkRole("Admin") or checkRole("General User")
function checkRole(expectedRole) {
  return async (req, res, next) => {
    const wallet = req.headers['x-wallet'];

    if (!wallet || wallet.length !== 42 || !wallet.startsWith('0x')) {
      return res.status(400).json({ error: 'Wallet address is required in header: x-wallet' });
    }

    try {
      const contract = await getLumosContract();
      const roleId = await contract.roles(wallet);

      if (Number(roleId) !== roleMap[expectedRole]) {
        return res.status(403).json({ error: `Access denied. You must be a ${expectedRole}` });
      }

      // ✅ Pass wallet to the request for further use in routes
      req.wallet = wallet;

      next(); // 🚀 Continue to the actual route handler
    } catch (err) {
      console.error('❌ Role check failed:', err);
      res.status(500).json({ error: 'Role check failed', reason: err.message });
    }
  };
}

module.exports = checkRole;
