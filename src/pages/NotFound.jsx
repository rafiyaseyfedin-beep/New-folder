import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center'
    }}>
      <div className="dash-card" style={{ maxWidth: '480px', width: '100%', padding: '3rem 2rem', background: '#ffffff' }}>
        
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--blue-light)',
          color: 'var(--blue-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          <Layers size={28} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--blue-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.5rem' }}>
          Page Not Found
        </h2>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '2rem' }}>
          The page or route you are looking for does not exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-blue" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            <Home size={15} /> Return to Landing Page
          </Link>
          <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            <LayoutDashboard size={15} /> Open Dashboard Portal
          </Link>
        </div>

      </div>
    </div>
  );
}
