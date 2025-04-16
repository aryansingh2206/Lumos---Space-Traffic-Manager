const { ethers } = require('ethers');
const deployed = require('../deployed.json');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

function getLumosContract() {
  const { address, abi } = deployed.LumosManager;

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("Missing PRIVATE_KEY in .env");

  const signer = new ethers.Wallet(privateKey, provider);

  return new ethers.Contract(address, abi, signer);
}

module.exports = getLumosContract;
