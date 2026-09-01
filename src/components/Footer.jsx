import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      padding: '1.25rem 1.5rem',
      marginTop: 'auto',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
      fontSize: '0.825rem',
      color: '#64748b',
      fontWeight: 500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span>&copy; 2026</span>
        <strong style={{ color: '#0f172a', fontWeight: 700 }}>Debo Engineering.</strong>
        <span>All rights reserved.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
        <span style={{ color: '#94a3b8' }}>Debo Workspace System</span>
        <span style={{ color: '#0284c7', fontWeight: 600 }}>Enterprise Platform</span>
      </div>
    </footer>
  );
}
