import React from 'react';

export default function About() {
  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        About <span className="gradient-text">NovaCraft</span>
      </h1>
      <div className="glass-panel" style={{ padding: '2.5rem', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1rem', fontSize: '1.05rem' }}>
          NovaCraft Studio is designed as a high-performance web template and directory architecture for scaling modern web projects.
        </p>
        <p>
          It enforces clean separation of concerns: components, hooks, services, contexts, routes, and styles are independently organized for maintainability.
        </p>
      </div>
    </div>
  );
}
