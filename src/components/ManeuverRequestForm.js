'use client';

import { useState, useEffect } from 'react';

export default function ManeuverRequestForm() {
  const [formData, setFormData] = useState({
    satelliteId: '',
    proposedDate: '',
    semiMajorAxis: '',
    eccentricity: '',
    inclination: '',
    raan: '',
    argPeriapsis: '',
    trueAnomaly: '',
    reason: '',
  });

  const [status, setStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('walletAddress');
    if (saved) setWalletAddress(saved);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletAddress) {
      setStatus('❌ Wallet not connected');
      return;
    }

    const orbitDetails = `
      semiMajorAxis:${formData.semiMajorAxis},
      eccentricity:${formData.eccentricity},
      inclination:${formData.inclination},
      raan:${formData.raan},
      argPeriapsis:${formData.argPeriapsis},
      trueAnomaly:${formData.trueAnomaly}
    `.trim();

    const details = `
      Satellite: ${formData.satelliteId}
      Date: ${formData.proposedDate}
      Orbit: { ${orbitDetails} }
      Reason: ${formData.reason}
    `.trim();

    try {
      const response = await fetch('http://localhost:5000/api/maneuver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet': walletAddress,
        },
        body: JSON.stringify({ details }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Maneuver request submitted!\nTx Hash: ${data.txHash}`);
        setFormData({
          satelliteId: '',
          proposedDate: '',
          semiMajorAxis: '',
          eccentricity: '',
          inclination: '',
          raan: '',
          argPeriapsis: '',
          trueAnomaly: '',
          reason: '',
        });
      } else {
        setStatus(`❌ Failed to submit: ${data.reason || data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Network error. Could not connect to server.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔄 Maneuver Request Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="satelliteId" placeholder="Satellite ID" value={formData.satelliteId} onChange={handleChange} style={styles.input} required />
        <input type="date" name="proposedDate" value={formData.proposedDate} onChange={handleChange} style={styles.input} required />

        <h4>🛰️ Orbital Parameters</h4>
        <input type="number" step="any" name="semiMajorAxis" placeholder="Semi-Major Axis" value={formData.semiMajorAxis} onChange={handleChange} style={styles.input} required />
        <input type="number" step="any" name="eccentricity" placeholder="Eccentricity" value={formData.eccentricity} onChange={handleChange} style={styles.input} required />
        <input type="number" step="any" name="inclination" placeholder="Inclination" value={formData.inclination} onChange={handleChange} style={styles.input} required />
        <input type="number" step="any" name="raan" placeholder="RAAN" value={formData.raan} onChange={handleChange} style={styles.input} required />
        <input type="number" step="any" name="argPeriapsis" placeholder="Argument of Periapsis" value={formData.argPeriapsis} onChange={handleChange} style={styles.input} required />
        <input type="number" step="any" name="trueAnomaly" placeholder="True Anomaly" value={formData.trueAnomaly} onChange={handleChange} style={styles.input} required />

        <textarea name="reason" placeholder="Reason for Maneuver" value={formData.reason} onChange={handleChange} style={styles.textarea} required />
        <button type="submit" style={styles.button}>Submit Maneuver Request</button>
      </form>

      <p style={{ marginTop: '20px', whiteSpace: 'pre-wrap', color: '#ccc' }}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '60px',
    textAlign: 'center',
  },
  form: {
    display: 'inline-block',
    textAlign: 'left',
    maxWidth: '500px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
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
    backgroundColor: '#f57c00',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
