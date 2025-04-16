'use client';

import { useEffect, useState } from 'react';

export default function RegulatorDashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [launchRequests, setLaunchRequests] = useState([]);
  const [maneuverRequests, setManeuverRequests] = useState([]);

  useEffect(() => {
    fetchLaunchRequests();
    fetchManeuverRequests();
  }, []);

  const fetchLaunchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/launch');
      const data = await res.json();
      const pending = data.launches.filter((req) => req.status === 'Pending');
      setLaunchRequests(pending);
    } catch (err) {
      console.error('Error fetching launch requests:', err);
    }
  };

  const fetchManeuverRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maneuver');
      const data = await res.json();
      const pending = data.maneuvers.filter((req) => req.status === 'Pending');
      setManeuverRequests(pending);
    } catch (err) {
      console.error('Error fetching maneuver requests:', err);
    }
  };

  const reviewRequest = async (type, id, approve) => {
    const endpoint =
      type === 'launch'
        ? 'http://localhost:5000/api/review/launch'
        : 'http://localhost:5000/api/review/maneuver';

    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) {
      alert('Wallet not connected or session expired.');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet': wallet,
        },
        body: JSON.stringify({ id, approve }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${type === 'launch' ? 'Launch' : 'Maneuver'} request ${approve ? 'approved' : 'rejected'}`);
        fetchLaunchRequests();
        fetchManeuverRequests();
      } else {
        alert(`❌ Error: ${data.reason || data.error}`);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      alert('Network error');
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.console}>
        <h1 style={styles.heading}> Orbital Command Center</h1>
        <p style={styles.subtext}>Review and manage orbital space traffic requests.</p>

        <div style={styles.buttonGroup}>
          <button onClick={() => setActiveSection('launch')} style={activeSection === 'launch' ? styles.activeButton : styles.inactiveButton}>
             Launch Requests
          </button>
          <button onClick={() => setActiveSection('maneuver')} style={activeSection === 'maneuver' ? styles.activeButton : styles.inactiveButton}>
             Maneuver Requests
          </button>
        </div>

        {activeSection === 'launch' && (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Pending Launch Requests</h2>
            {launchRequests.map((req) => (
              <div key={req.id} style={styles.requestBox}>
                <p><strong> Details:</strong> {req.details}</p>
                <p><strong> Submitted By:</strong> {req.submittedBy}</p>
                <div style={styles.actionRow}>
                  <button onClick={() => reviewRequest('launch', req.id, true)} style={styles.approve}>Approve</button>
                  <button onClick={() => reviewRequest('launch', req.id, false)} style={styles.reject}>Reject</button>
                </div>
              </div>
            ))}
          </section>
        )}

        {activeSection === 'maneuver' && (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Pending Maneuver Requests</h2>
            {maneuverRequests.map((req) => (
              <div key={req.id} style={styles.requestBox}>
                <p><strong> Details:</strong> {req.details}</p>
                <p><strong> Submitted By:</strong> {req.submittedBy}</p>
                <div style={styles.actionRow}>
                  <button onClick={() => reviewRequest('maneuver', req.id, true)} style={styles.approve}>Approve</button>
                  <button onClick={() => reviewRequest('maneuver', req.id, false)} style={styles.reject}>Reject</button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Orbital animation background */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #0d0d1a, #1a1a2e);
          background-size: cover;
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
  },
  console: {
    backgroundColor: 'rgba(20, 20, 35, 0.9)',
    padding: '40px',
    borderRadius: '16px',
    border: '2px solid #ff9f43',
    boxShadow: '0 0 30px #ff9f43',
    width: '100%',
    maxWidth: '900px',
  },
  heading: {
    fontSize: '32px',
    color: '#ff9f43',
    marginBottom: '8px',
    textShadow: '0 0 10px #ff9f43',
  },
  subtext: {
    fontSize: '14px',
    color: '#aaa',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  activeButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#ff9f43',
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 0 12px #ff9f43',
  },
  inactiveButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #888',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#f5f5f5',
  },
  card: {
    backgroundColor: 'rgba(10, 10, 25, 0.8)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
  },
  requestBox: {
    backgroundColor: '#1a1a2e',
    border: '1px solid #555',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '20px',
    boxShadow: '0 0 10px rgba(255,255,255,0.05)',
    transition: 'transform 0.3s ease',
  },
  actionRow: {
    marginTop: '10px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  approve: {
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 0 12px #4caf50',
    transition: 'all 0.3s ease',
  },
  reject: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 0 12px #f44336',
    transition: 'all 0.3s ease',
  },
};
