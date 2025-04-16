'use client';

import React from 'react';

export default function RoleDashboard({ role }) {
  switch (role) {
    case 'Admin':
      return (
        <div>
          <h2>🛠️ Admin Dashboard</h2>
          <p>Manage users, system settings, and oversee all activity.</p>
        </div>
      );

    case 'Regulatory Body':
      return (
        <div>
          <h2>📡 Regulatory Dashboard</h2>
          <p>Review and approve satellite launch and maneuver requests.</p>
        </div>
      );

    case 'General User':
      return (
        <div>
          <h2>👨‍🚀 User Dashboard</h2>
          <p>Submit and track your launch/maneuver requests.</p>
        </div>
      );

    default:
      return (
        <div>
          <h2>❌ Unknown Role</h2>
          <p>Your wallet address is not mapped to any role.</p>
        </div>
      );
  }
}
