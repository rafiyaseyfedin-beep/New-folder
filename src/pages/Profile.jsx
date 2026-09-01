import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import {
  Save,
  Loader2
} from 'lucide-react';

export default function Profile() {
  const { currentUser, currentRole, updateUser } = useApp();

  // Local state initialized with context user details
  const [name, setName] = useState(currentUser.name || 'ebasahuluka');
  const [email, setEmail] = useState(currentUser.email || 'ebasahuluka@gmail.com');
  const [phone, setPhone] = useState(currentUser.phone || '+251 94 954 0860');
  const [team, setTeam] = useState(currentUser.team || 'Frontend Web');
  const [role, setRole] = useState(currentUser.role || currentRole || 'ADMIN');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'EM');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch the actual authenticated user metadata from Supabase Auth on mount
  useEffect(() => {
    async function fetchAuthUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setName(user.user_metadata?.name || name);
          setEmail(user.email || email);
          if (user.user_metadata?.role) setRole(user.user_metadata.role);
          if (user.user_metadata?.avatar) setAvatar(user.user_metadata.avatar);
        }
      } catch (err) {
        console.warn('Supabase Auth fetch warning:', err);
      }
    }
    fetchAuthUser();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);
    setErrorMsg('');

    try {
      // 1. Update public.users table in Supabase via Context updateUser
      await updateUser(currentUser.id || 'u_active', {
        name,
        email,
        phone,
        team,
        role,
        avatar
      });

      // 2. Update Supabase Auth account profile metadata
      const { error: authErr } = await supabase.auth.updateUser({
        email: email,
        data: {
          name: name,
          role: role,
          avatar: avatar
        }
      });

      if (authErr) {
        console.warn('Supabase Auth metadata update notice:', authErr.message);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to sync profile updates to Supabase:', err);
      setErrorMsg('Failed to save to Supabase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 110px)',
      gap: '1.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* 1. Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.25rem' }}>
          My Profile
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600, marginTop: '0.2rem' }}>
          Manage your personal information and account settings
        </p>
      </div>

      {saveSuccess && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#166534',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          Profile details updated successfully!
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          {errorMsg}
        </div>
      )}

      {/* 2. Two-Column Information Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Personal Information Form */}
        <form onSubmit={handleSaveProfile} className="dash-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
            Personal Information
          </h3>



          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-blue"
              style={{
                fontSize: '0.775rem',
                padding: '0.5rem 1.15rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite', marginRight: '0.35rem' }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} style={{ marginRight: '0.35rem' }} /> Update Profile
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Recent Activity */}
        <div className="dash-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
            Recent Activity
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            
            {/* Activity Item 1 */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--blue-primary)',
                marginTop: '0.45rem',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Logged in</strong>
                <p style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                  User logged into account as {role === 'ADMIN' ? 'superAdmin' : role.toLowerCase()}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>an hour ago</span>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                marginTop: '0.45rem',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Profile Update</strong>
                <p style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                  Modified profile details and corporate credentials
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>2 hours ago</span>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#8b5cf6',
                marginTop: '0.45rem',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Task Completed</strong>
                <p style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                  Finished evaluating dashboard stats integration
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>1 day ago</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>

      {/* 4. Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        © 2026 Project Manager. All rights reserved.
      </footer>

    </div>
  );
}
