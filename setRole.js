const { ethers } = require("ethers");
const deployed = require("../deployed.json");
require("dotenv").config();

async function main() {
  const contractAddress = deployed.LumosManager.address;
  const abi = deployed.LumosManager.abi;

  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = new ethers.Wallet(privateKey, provider);

  const contract = new ethers.Contract(contractAddress, abi, signer);

  const userToAssign = signer.address; // Or any other valid address
  const role = 3; // GeneralUser

  const tx = await contract.assignRole(userToAssign, role);
  await tx.wait();

  console.log(`✅ Assigned role ${role} to ${userToAssign}`);
}

main().catch((err) => {
  console.error("❌ Role assignment failed:", err);
  process.exit(1);
});
