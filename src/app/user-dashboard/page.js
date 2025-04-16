'use client';

import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const [activeHistory, setActiveHistory] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [launchRequests, setLaunchRequests] = useState([]);
  const [maneuverRequests, setManeuverRequests] = useState([]);

  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) setWalletAddress(savedWallet);
  }, []);

  useEffect(() => {
    if (walletAddress && activeHistory === 'launch') fetchLaunchHistory();
    if (walletAddress && activeHistory === 'maneuver') fetchManeuverHistory();
  }, [activeHistory, walletAddress]);

  const fetchLaunchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/launch', {
        headers: {
          'x-wallet': walletAddress,
        },
      });
      const data = await res.json();
      setLaunchRequests(data.launches || []);
    } catch (err) {
      console.error('Error fetching launch history:', err);
    }
  };

  const fetchManeuverHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maneuver', {
        headers: {
          'x-wallet': walletAddress,
        },
      });
      const data = await res.json();
      setManeuverRequests(data.maneuvers || []);
    } catch (err) {
      console.error('Error fetching maneuver history:', err);
    }
  };

  const openPopup = (path) => {
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      path,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <main style={styles.page}>
      <div style={styles.console}>
        <h1 style={styles.heading}>Mission Control Console</h1>
        <p style={styles.subtext}>Connected Wallet: <span style={styles.wallet}>{walletAddress}</span></p>

        <div style={styles.buttonGroup}>
          <button onClick={() => openPopup('/launch-request')} style={styles.glowButtonPrimary}>
             Launch Request
          </button>
          <button onClick={() => openPopup('/maneuver-request')} style={styles.glowButtonSecondary}>
             Maneuver Request
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={() => setActiveHistory('launch')}
            style={activeHistory === 'launch' ? styles.activeToggle : styles.inactiveToggle}
          >
             Launch Request History
          </button>
          <button
            onClick={() => setActiveHistory('maneuver')}
            style={activeHistory === 'maneuver' ? styles.activeToggle : styles.inactiveToggle}
          >
             Maneuver Request History
          </button>
        </div>

        {activeHistory === 'launch' && (
          <section style={styles.historyPanel}>
            <h2 style={styles.historyHeading}>Launch Request Log</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {launchRequests.map((req, idx) => (
                  <tr key={idx}>
                    <td>{req.details}</td>
                    <td>{req.submittedBy}</td>
                    <td>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeHistory === 'maneuver' && (
          <section style={styles.historyPanel}>
            <h2 style={styles.historyHeading}>Maneuver Request Log</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {maneuverRequests.map((req, idx) => (
                  <tr key={idx}>
                    <td>{req.details}</td>
                    <td>{req.submittedBy}</td>
                    <td>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>

      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #f5f5f5;
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '50px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    background: 'transparent',
  },
  console: {
    backgroundColor: 'rgba(15, 15, 25, 0.9)',
    padding: '40px',
    borderRadius: '20px',
    border: '2px solid #0ef6cc',
    boxShadow: '0 0 30px #0ef6cc',
    width: '100%',
    maxWidth: '1000px',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '10px',
    color: '#0ef6cc',
    textShadow: '0 0 10px #0ef6cc',
  },
  subtext: {
    color: '#ccc',
    fontSize: '14px',
    marginBottom: '30px',
  },
  wallet: {
    color: '#0ef6cc',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  glowButtonPrimary: {
    padding: '12px 24px',
    fontSize: '18px',
    background: '#0ef6cc',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 12px #0ef6cc',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  glowButtonSecondary: {
    padding: '12px 24px',
    fontSize: '18px',
    background: '#f57c00',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 12px #f57c00',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  activeToggle: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0ef6cc',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  inactiveToggle: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  historyPanel: {
    marginTop: '30px',
  },
  historyHeading: {
    fontSize: '22px',
    marginBottom: '15px',
    textShadow: '0 0 8px #0ef6cc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
};
