import { ethers } from 'ethers';
import deployed from '../constants/deployed.json'; // Make sure this path matches

export function getContract(signer) {
  const { address, abi } = deployed.LumosManager;
  return new ethers.Contract(address, abi, signer);
}
