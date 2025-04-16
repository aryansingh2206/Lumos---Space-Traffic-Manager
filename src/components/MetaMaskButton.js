'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function MetaMaskButton({ onConnected }) {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Force MetaMask to prompt account selector
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const userWallet = accounts[0];

        setAccount(userWallet);
        sessionStorage.setItem('walletAddress', userWallet);
        window.dispatchEvent(new Event('storage')); // ✅ Trigger same-tab update
        onConnected(userWallet);
      } catch (err) {
        console.error("Connection failed:", err);
      }
    } else {
      alert('Please install MetaMask extension!');
    }
  };

  useEffect(() => {
    if (window.ethereum?.selectedAddress) {
      const saved = window.ethereum.selectedAddress;
      setAccount(saved);
      sessionStorage.setItem('walletAddress', saved);
      window.dispatchEvent(new Event('storage')); // ✅ Also dispatch here
      onConnected(saved);
    }
  }, []);

  return (
    <button onClick={connectWallet}>
      {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect to MetaMask'}
    </button>
  );
}
