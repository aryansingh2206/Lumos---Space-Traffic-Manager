'use client';

import ManeuverRequestForm from '../../components/ManeuverRequestForm';

export default function ManeuverRequestPage() {
  return (
    <main style={{ textAlign: 'center', marginTop: '60px' }}>
      <h2> Submit Maneuver Request</h2>
      <ManeuverRequestForm />
    </main>
  );
}
