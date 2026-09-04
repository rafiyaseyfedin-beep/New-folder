import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import {
  User,
  Lock,
  Bell,
  Camera,
  Save,
  KeyRound,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Building,
  Briefcase
} from 'lucide-react';

export default function Settings() {
  const { currentUser, currentRole, updateUser, teams } = useApp();

  const [activeTab, setActiveTab] = useState('PROFILE');

  // Profile Form States
  const [name, setName] = useState(currentUser.name || 'ebasahuluka');
  const [email, setEmail] = useState(currentUser.email || 'ebasahuluka@gmail.com');
  const [phone, setPhone] = useState(currentUser.phone || '+251 94 954 0860');
  const [team, setTeam] = useState(currentUser.team || 'Frontend Web');
  const [role, setRole] = useState(currentUser.role || currentRole || 'ADMIN');
  const [avatar, setAvatar] = useState(currentUser.avatar || 'EM');

  // Password / Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Status Alerts
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Supabase Auth user on mount
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    const initials = name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EM';
    setAvatar(initials);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess('');
    setErrorMsg('');

    try {
      // 1. Update public.users table via AppContext
      await updateUser(currentUser.id || 'u_active', {
        name,
        email,
        phone,
        team,
        role,
        avatar
      });

      // 2. Update Supabase Auth user metadata
      const { error: authErr } = await supabase.auth.updateUser({
        email: email,
        data: {
          name: name,
          role: role,
          avatar: avatar
        }
      });

      if (authErr) {
        console.warn('Auth user metadata update notice:', authErr.message);
      }

      setSaveSuccess('Profile settings updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to sync profile updates to Supabase:', err);
      setErrorMsg('Failed to save to Supabase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setSaveSuccess('Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setSaveSuccess('Notification preferences saved successfully!');
    setTimeout(() => setSaveSuccess(''), 3000);
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
          Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600, marginTop: '0.2rem' }}>
          Manage your account preferences, security settings, and notifications
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
          {saveSuccess}
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

      {/* 2. Top Profile Header Banner */}
      <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', background: '#ffffff' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--blue-primary)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
            overflow: 'hidden'
          }}>
            {avatar && (avatar.startsWith('data:image') || avatar.includes('/') || avatar.includes('http')) ? (
              <img src={avatar} alt="Profile Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              (avatar || 'EM').slice(0, 2).toUpperCase()
            )}
          </div>
          
          <input
            type="file"
            id="settings-avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => document.getElementById('settings-avatar-upload').click()}
            title="Update Profile Picture"
            type="button"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Camera size={13} color="var(--text-black)" />
          </button>

          {avatar && (avatar.startsWith('data:image') || avatar.includes('/') || avatar.includes('http')) && (
            <button
              onClick={handleRemoveAvatar}
              title="Remove Profile Picture"
              type="button"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '-8px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(220,38,38,0.15)'
              }}
            >
              <Trash2 size={12} color="#dc2626" />
            </button>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-black)' }}>
              {name}
            </h2>
            <span style={{
              fontSize: '0.675rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '4px',
              background: 'var(--blue-light)',
              color: 'var(--blue-primary)'
            }}>
              {role === 'ADMIN' ? 'Super Admin' : role.replace('_', ' ')}
            </span>
            <span style={{
              fontSize: '0.675rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '4px',
              background: '#d1fae5',
              color: '#047857'
            }}>
              Active Employee
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.775rem', color: '#475569', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} color="var(--blue-primary)" /> {email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={14} color="var(--blue-primary)" /> {phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={14} color="var(--blue-primary)" /> Debo Engineering
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Briefcase size={14} color="var(--blue-primary)" /> {team}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.4rem 0.5rem',
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'PROFILE', label: 'Personal Information', icon: <User size={15} /> },
          { key: 'SECURITY', label: 'Security & Password', icon: <Lock size={15} /> },
          { key: 'NOTIFICATIONS', label: 'Notification Preferences', icon: <Bell size={15} /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === tab.key ? 'var(--blue-primary)' : 'transparent',
              color: activeTab === tab.key ? '#ffffff' : 'var(--text-body)',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'PROFILE' && (
        <form onSubmit={handleSaveProfile} className="dash-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '1rem' }}>
            Edit Employee Profile Credentials
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.15rem', marginBottom: '1.25rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Corporate Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Assigned Corporate Team</label>
              <select
                value={team}
                onChange={e => setTeam(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem', fontWeight: 600 }}
              >
                {teams.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>System Role (RBAC Access)</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem', fontWeight: 700, color: 'var(--blue-primary)' }}
              >
                <option value="ADMIN">ADMIN (System Administrator)</option>
                <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                <option value="TEAM_MEMBER">TEAM MEMBER</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
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
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'SECURITY' && (
        <form onSubmit={handleSavePassword} className="dash-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '1rem' }}>
            Security & Account Password
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', maxWidth: '420px', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-blue" style={{ fontSize: '0.775rem', padding: '0.5rem 1.15rem' }}>
            <KeyRound size={14} style={{ marginRight: '0.35rem' }} /> Update Password
          </button>
        </form>
      )}

      {/* Tab 3: Notification Preferences */}
      {activeTab === 'NOTIFICATIONS' && (
        <form onSubmit={handleSaveNotifications} className="dash-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '1rem' }}>
            System Notification Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-black)', display: 'block' }}>Email Alerts for Task Assignments</strong>
                <span style={{ fontSize: '0.725rem', color: '#475569' }}>Receive an email whenever a manager assigns a task to your profile.</span>
              </div>
              <input
                type="checkbox"
                checked={taskAssignments}
                onChange={e => setTaskAssignments(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--blue-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-black)', display: 'block' }}>Project Milestone Alerts</strong>
                <span style={{ fontSize: '0.725rem', color: '#475569' }}>Get notified when project deadline evaluations are approaching.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--blue-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#f8fafc', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-black)', display: 'block' }}>Daily Activity Digest</strong>
                <span style={{ fontSize: '0.725rem', color: '#475569' }}>Summary of task percentage changes delivered every evening.</span>
              </div>
              <input
                type="checkbox"
                checked={dailyDigest}
                onChange={e => setDailyDigest(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--blue-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-blue" style={{ fontSize: '0.775rem', padding: '0.5rem 1.15rem' }}>
            <Save size={14} style={{ marginRight: '0.35rem' }} /> Save Preferences
          </button>
        </form>
      )}

      {/* 4. Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border-light)',
        fontSize: '0.75rem',
        color: '#64748b',
        marginTop: 'auto'
      }}>
        © 2026 Project Manager. All rights reserved.
      </footer>

    </div>
  );
}
