import React from 'react';

export default function Services() {
  const services = [
    { title: 'Web App Development', desc: 'Custom React & Vite single-page applications.' },
    { title: 'API Integration', desc: 'Seamless REST & GraphQL backend service wiring.' },
    { title: 'UI/UX Design Systems', desc: 'Modular design tokens and custom CSS styling.' },
  ];

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Our <span className="gradient-text">Services</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {services.map((s, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
