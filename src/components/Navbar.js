'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [wallet, setWallet] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) {
      setWallet(savedWallet);
    }

    const handleStorageChange = () => {
      const updatedWallet = sessionStorage.getItem('walletAddress');
      setWallet(updatedWallet || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('walletAddress');
    sessionStorage.removeItem('userRole');
    setWallet('');
    setTimeout(() => {
      router.push('/');
      window.location.reload();
    }, 300);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link href="/" style={styles.link}> Lumos</Link>
      </div>
      <div style={styles.navLinks}>
        <Link href="/" style={styles.link}>Home</Link>
        {/* 👇 Removed Dashboard Link */}
      </div>
      <div style={styles.rightSection}>
        {wallet ? (
          <>
            <span style={styles.wallet}>
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span style={{ fontSize: '14px', color: '#ccc' }}>Not Connected</span>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  wallet: {
    fontSize: '14px',
    backgroundColor: '#333',
    padding: '6px 12px',
    borderRadius: '8px',
  },
  logoutButton: {
    backgroundColor: '#ff4c4c',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
