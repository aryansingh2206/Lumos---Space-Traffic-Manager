'use client';

import { useState } from 'react';

export default function LaunchRequestForm() {
  const [formData, setFormData] = useState({
    missionName: '',
    launchDate: '',
    orbitType: '',
    purpose: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const walletAddress = sessionStorage.getItem('walletAddress');
    if (!walletAddress) {
      setStatus('❌ Wallet not connected.');
      return;
    }

    const details = `
      Mission: ${formData.missionName}
      Date: ${formData.launchDate}
      Orbit: ${formData.orbitType}
      Purpose: ${formData.purpose}
    `.trim();

    try {
      const response = await fetch('http://localhost:5000/api/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet': walletAddress, // ✅ required by backend
        },
        body: JSON.stringify({ details }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Launch request submitted!\nTx Hash: ${data.txHash}`);
        setFormData({ missionName: '', launchDate: '', orbitType: '', purpose: '' });
      } else {
        setStatus(`❌ Failed to submit: ${data.reason || data.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Network error. Could not connect to server.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>🚀 Launch Request Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="missionName"
          placeholder="Mission Name"
          value={formData.missionName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="date"
          name="launchDate"
          value={formData.launchDate}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="orbitType"
          placeholder="Orbit Type (LEO/MEO/GEO)"
          value={formData.orbitType}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="purpose"
          placeholder="Purpose of Launch"
          value={formData.purpose}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Submit Launch Request</button>
      </form>

      <p style={{ marginTop: '20px', whiteSpace: 'pre-wrap', color: '#ccc' }}>
        {status}
      </p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '40px',
    textAlign: 'center',
  },
  form: {
    display: 'inline-block',
    textAlign: 'left',
    maxWidth: '400px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
