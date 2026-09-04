import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Loader2, Layers } from 'lucide-react';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useApp();
  const [isConfirming, setIsConfirming] = useState(true);

  const handleConfirmLogout = async () => {
    setIsConfirming(false);
    await logout();
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div className="dash-card" style={{ width: '100%', maxWidth: '440px', padding: '2.25rem', background: '#ffffff' }}>
        
        {/* Brand Logo - Matches Login/Register styling exactly */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--blue-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}>
            <Layers size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', letterSpacing: '-0.03em' }}>
            Debo<span style={{ color: 'var(--blue-primary)' }}>Manage</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isConfirming ? 'Confirm Sign Out' : 'Signing Out...'}
          </p>
        </div>

        {isConfirming ? (
          /* 1. Confirmation Screen Content */
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: '1.75rem'
            }}>
              Are you sure you want to end your current session? You will need to log back in to manage your projects and tasks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={handleConfirmLogout}
                className="btn btn-blue"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.825rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                }}
              >
                <LogOut size={15} /> Yes, Sign Out
              </button>
              
              <button
                onClick={handleCancel}
                className="btn btn-outline"
                style={{
                  justifyContent: 'center',
                  padding: '0.65rem 1rem',
                  fontSize: '0.825rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Cancel and Return
              </button>
            </div>
          </div>
        ) : (
          /* 2. Logging Out Status Screen Content */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              lineHeight: 1.5,
              marginBottom: '1.5rem'
            }}>
              Securing your credentials and ending your session. Please wait...
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.775rem',
              color: 'var(--blue-primary)',
              fontWeight: 700
            }}>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Redirecting to Login portal...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
