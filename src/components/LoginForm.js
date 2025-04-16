'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract'; // 🔁 Make sure this utility returns the contract instance

export default function LoginForm() {
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) setWallet(savedWallet);
  }, []);

  const handleLogin = async () => {
    if (!wallet) {
      alert('⚠️ Please connect MetaMask first.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const roleId = await contract.roles(wallet); // on-chain check
      const role = Number(roleId);

      let roleName = null;

      if (role === 1) roleName = 'Admin';
      else if (role === 2) roleName = 'Regulatory Body';
      else if (role === 3) roleName = 'General User';

      if (!roleName) {
        alert("❌ No role assigned to this wallet. Please register first.");
        return;
      }

      // 🔁 NEW: Notify backend to track this user
      await fetch(`http://localhost:5000/api/role/${wallet}`);

      // Save to sessionStorage
      sessionStorage.setItem('userRole', roleName);

      // Redirect based on role
      switch (roleName) {
        case 'Admin':
          router.push('/admin-dashboard');
          break;
        case 'Regulatory Body':
          router.push('/regulator-dashboard');
          break;
        case 'General User':
          router.push('/user-dashboard');
          break;
        default:
          alert('❌ Unknown role detected.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('❌ Login failed. See console for details.');
    }
  };

  return (
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <h2>🔐 Login</h2>
      <p style={{ color: '#ccc' }}>Wallet: {wallet || 'Not connected'}</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login to Dashboard
      </button>
      <p style={{ color: '#f44336', marginTop: '10px' }}>{status}</p>
    </div>
  );
}
