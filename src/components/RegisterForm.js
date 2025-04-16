'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';

export default function RegisterForm() {
  const [wallet, setWallet] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const roleMap = {
    'Admin': 1,
    'Regulatory Body': 2,
    'General User': 3,
  };

  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) setWallet(savedWallet);
  }, []);

  const handleRegister = async () => {
    if (!wallet) {
      alert('Please connect your MetaMask wallet first.');
      return;
    }

    if (!role || !roleMap[role]) {
      alert('Please select a valid role.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      // Register on blockchain
      const tx = await contract.registerSelf(roleMap[role]);
      await tx.wait();

      // Save user to MongoDB via backend (regardless of on-chain state)
      await fetch(`http://localhost:5000/api/role/${wallet}`);

      sessionStorage.setItem('userRole', role);

      // Redirect based on selected role
      switch (role) {
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
          alert('Invalid role');
      }

      setStatus('✅ Registered and role assigned!');
    } catch (err) {
      console.error('❌ Role assignment failed:', err);
      setStatus('❌ Failed to register role: ' + (err.reason || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register Your Role</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
        <option value="">-- Select Role --</option>
        <option value="Admin">Admin</option>
        <option value="Regulatory Body">Regulatory Body</option>
        <option value="General User">General User</option>
      </select>
      <br />
      <button style={styles.button} onClick={handleRegister}>Register</button>
      <p style={{ marginTop: '10px', color: '#ccc' }}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '40px',
    textAlign: 'center',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};
