'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [users, setUsers] = useState([]);
  const [launchRequests, setLaunchRequests] = useState([]);
  const [maneuverRequests, setManeuverRequests] = useState([]);

  useEffect(() => {
    const savedWallet = sessionStorage.getItem('walletAddress');
    if (savedWallet) setWalletAddress(savedWallet);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchUsers(walletAddress);
      fetchLaunchRequests();
      fetchManeuverRequests();
    }
  }, [walletAddress]);

  const fetchUsers = async (wallet) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'x-wallet': wallet,
        },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchLaunchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/launch');
      const data = await res.json();
      setLaunchRequests(data.launches || []);
    } catch (err) {
      console.error('Failed to fetch launch requests:', err);
    }
  };

  const fetchManeuverRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/maneuver');
      const data = await res.json();
      setManeuverRequests(data.maneuvers || []);
    } catch (err) {
      console.error('Failed to fetch maneuver requests:', err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLaunchRequests = launchRequests.filter(
    (req) =>
      req.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredManeuverRequests = maneuverRequests.filter(
    (req) =>
      req.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <p style={styles.subheading}></p>

      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div style={styles.statBox}>
          <h3>Launch Requests</h3>
          <p>{launchRequests.length}</p>
        </div>
        <div style={styles.statBox}>
          <h3>Maneuver Requests</h3>
          <p>{maneuverRequests.length}</p>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={() => { setActiveSection('users'); setSearchQuery(''); }}
          style={activeSection === 'users' ? styles.buttonActive : styles.buttonNeutral}
        > View Users</button>
        <button
          onClick={() => { setActiveSection('launch'); setSearchQuery(''); }}
          style={activeSection === 'launch' ? styles.buttonActive : styles.buttonNeutral}
        > View Launch Requests</button>
        <button
          onClick={() => { setActiveSection('maneuver'); setSearchQuery(''); }}
          style={activeSection === 'maneuver' ? styles.buttonActive : styles.buttonNeutral}
        > View Maneuver Requests</button>
      </div>

      {activeSection && (
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      )}

      {activeSection === 'users' && (
        <section style={styles.section}>
          <h2> Registered Users</h2>
          <table style={styles.table}>
            <thead><tr><th>Wallet Address</th><th>Role</th></tr></thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx}><td>{user.wallet}</td><td>{user.role}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeSection === 'launch' && (
        <section style={styles.section}>
          <h2> All Launch Requests</h2>
          <table style={styles.table}>
            <thead><tr><th>Details</th><th>Submitted By</th><th>Status</th></tr></thead>
            <tbody>
              {filteredLaunchRequests.map((req, idx) => (
                <tr key={idx}><td>{req.details}</td><td>{req.submittedBy}</td><td>{req.status}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeSection === 'maneuver' && (
        <section style={styles.section}>
          <h2> All Maneuver Requests</h2>
          <table style={styles.table}>
            <thead><tr><th>Details</th><th>Submitted By</th><th>Status</th></tr></thead>
            <tbody>
              {filteredManeuverRequests.map((req, idx) => (
                <tr key={idx}><td>{req.details}</td><td>{req.submittedBy}</td><td>{req.status}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #1c1c2b, #090c1b, #0b0f30);
          background-attachment: fixed;
          background-size: cover;
          color: #f5f5f5;
          font-family: 'Orbitron', sans-serif;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: #5c67f2;
          border-radius: 4px;
        }
      `}</style>
    </main>
  );
}

const styles = {
  page: {
    padding: '60px 20px',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '36px',
    color: '#c2f970',
    marginBottom: '10px',
    textShadow: '0 0 10px #5c67f2',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '16px',
    color: '#ccc',
    marginBottom: '30px',
    textAlign: 'center',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  statBox: {
    background: 'linear-gradient(145deg, #2c2c3d, #1e1e2f)',
    color: '#fff',
    padding: '20px 30px',
    borderRadius: '14px',
    boxShadow: '0 0 15px #5c67f2',
    minWidth: '160px',
    textAlign: 'center',
    transition: 'transform 0.3s ease-in-out',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  buttonNeutral: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#222',
    color: '#fff',
    border: '1px solid #5c67f2',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  buttonActive: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#5c67f2',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 0 12px #5c67f2',
  },
  section: {
    marginTop: '40px',
    backgroundColor: 'rgba(30, 30, 50, 0.6)',
    padding: '20px',
    borderRadius: '12px',
  },
  table: {
    width: '90%',
    margin: '0 auto',
    borderCollapse: 'collapse',
    backgroundColor: '#111',
    color: '#fff',
  },
  searchBox: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #5c67f2',
    width: '250px',
    backgroundColor: '#111',
    color: '#fff',
  },
};
