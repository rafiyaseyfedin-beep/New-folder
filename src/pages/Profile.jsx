import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { processAvatarFile, getInitials } from '../utils/avatarHelper';
import {
  Save,
  Loader2,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User,
  Shield,
  Mail,
  Phone,
  Building,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const { currentUser, currentRole, updateUser } = useApp();
  const fileInputRef = useRef(null);

  // Form states initialized with currentUser
  const [name, setName] = useState(currentUser?.name || 'Refiya Seyifadin');
  const [email, setEmail] = useState(currentUser?.email || 'rafiyaseyfedin@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+251 94 954 0860');
  const [team, setTeam] = useState(currentUser?.team || 'Management');
  const [role, setRole] = useState(currentUser?.role || currentRole || 'ADMIN');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'RS');

  // Feedback states
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Avatar upload states
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [avatarError, setAvatarError] = useState('');

  // Keep local state in sync whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.team) setTeam(currentUser.team);
      if (currentUser.role) setRole(currentUser.role);
      if (currentUser.avatar) setAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  // Also check Supabase Auth for the latest user metadata on mount
  useEffect(() => {
    async function fetchAuthUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.name) setName(user.user_metadata.name);
          if (user.email) setEmail(user.email);
          if (user.user_metadata?.role) setRole(user.user_metadata.role);
          if (user.user_metadata?.avatar) setAvatar(user.user_metadata.avatar);
        }
      } catch (err) {
        console.warn('Supabase Auth fetch notice:', err);
      }
    }
    fetchAuthUser();
  }, []);

  // Handle image file selection with client-side auto-optimization
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarError('');
    setAvatarSuccess('');

    try {
      // 1. Process & optimize image to high-quality 256x256 square JPEG (~20KB)
      // This prevents Supabase Auth payload limits and localStorage quota overflows
      const optimizedDataUrl = await processAvatarFile(file, 256, 0.85);

      // 2. Update local state immediately for instant feedback
      setAvatar(optimizedDataUrl);

      // 3. Persist to AppContext & localStorage
      const activeId = currentUser?.id || 'u_active';
      await updateUser(activeId, {
        name,
        email,
        phone,
        team,
        role,
        avatar: optimizedDataUrl
      });

      // 4. Safely sync to Supabase Auth metadata
      try {
        await supabase.auth.updateUser({
          data: {
            avatar: optimizedDataUrl
          }
        });
      } catch (authErr) {
        console.warn('Supabase Auth avatar update notice:', authErr);
      }

      setAvatarSuccess('Profile photo updated successfully!');
      setTimeout(() => setAvatarSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to process image:', err);
      setAvatarError(err.message || 'Failed to process image file. Please try another image.');
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Revert back to name initials
  const handleRemoveAvatar = async () => {
    setAvatarUploading(true);
    setAvatarError('');
    setAvatarSuccess('');

    try {
      const initials = getInitials(name || currentUser?.name || 'US');
      setAvatar(initials);

      const activeId = currentUser?.id || 'u_active';
      await updateUser(activeId, {
        name,
        email,
        phone,
        team,
        role,
        avatar: initials
      });

      try {
        await supabase.auth.updateUser({
          data: {
            avatar: initials
          }
        });
      } catch (authErr) {
        console.warn('Supabase Auth remove avatar notice:', authErr);
      }

      setAvatarSuccess('Profile photo removed. Initial avatar restored.');
      setTimeout(() => setAvatarSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to remove avatar:', err);
      setAvatarError('Failed to remove photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save all profile form fields
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess('');
    setErrorMsg('');

    try {
      const activeId = currentUser?.id || 'u_active';

      // 1. Update Context & LocalStorage
      await updateUser(activeId, {
        name,
        email,
        phone,
        team,
        role,
        avatar
      });

      // 2. Attempt Supabase Auth account profile metadata update
      try {
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
      } catch (authException) {
        console.warn('Supabase Auth update skipped or unreachable:', authException);
      }

      setSaveSuccess('Profile details updated successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isImageAvatar = Boolean(
    avatar && (avatar.startsWith('data:image') || avatar.includes('/') || avatar.includes('http'))
  );

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
          Manage your personal information, profile photo, and account details
        </p>
      </div>

      {/* Global Alerts */}
      {saveSuccess && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#166534',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#166534" />
          {saveSuccess}
        </div>
      )}

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <AlertCircle size={18} color="#991b1b" />
          {errorMsg}
        </div>
      )}

      {/* 2. Dedicated Profile Picture Upload Card */}
      <div className="dash-card" style={{
        padding: '1.5rem',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          
          {/* Avatar Preview & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            
            {/* Interactive Avatar Container */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile picture"
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(2, 132, 199, 0.28)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '3px solid #ffffff',
                  outline: '2px solid #bae6fd',
                  transition: 'transform 0.15s ease'
                }}
              >
                {isImageAvatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  (avatar || getInitials(name)).slice(0, 2).toUpperCase()
                )}

                {/* Processing Overlay */}
                {avatarUploading && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}>
                    <Loader2 size={24} className="animate-spin" color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>

              {/* Camera Icon Overlay Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo"
                disabled={avatarUploading}
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#0284c7',
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Camera size={15} />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handleAvatarFileChange}
              style={{ display: 'none' }}
            />

            {/* Avatar Details & Action Buttons */}
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-black)', margin: '0 0 0.25rem 0' }}>
                Profile Photo
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.85rem 0', maxWidth: '380px' }}>
                Upload a portrait photo to personalize your account across dashboards, reports, and team collaboration.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-blue"
                  style={{
                    fontSize: '0.775rem',
                    padding: '0.45rem 0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {avatarUploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      Optimizing & Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={13} />
                      Upload New Photo
                    </>
                  )}
                </button>

                {isImageAvatar && (
                  <button
                    type="button"
                    disabled={avatarUploading}
                    onClick={handleRemoveAvatar}
                    style={{
                      fontSize: '0.775rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      color: '#e11d48',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <Trash2 size={13} />
                    Remove Photo
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Quick Specifications */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '0.75rem',
            color: '#64748b',
            lineHeight: 1.5,
            maxWidth: '240px'
          }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>
              Image Guidelines:
            </strong>
            • Formats: JPG, PNG, WebP, GIF<br />
            • Auto-cropped to square (1:1)<br />
            • Automatically optimized for fast web loading
          </div>

        </div>

        {/* Inline Avatar Alerts */}
        {avatarSuccess && (
          <div style={{
            marginTop: '1rem',
            padding: '0.6rem 0.85rem',
            borderRadius: '6px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            <CheckCircle2 size={15} color="#166534" />
            {avatarSuccess}
          </div>
        )}

        {avatarError && (
          <div style={{
            marginTop: '1rem',
            padding: '0.6rem 0.85rem',
            borderRadius: '6px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}>
            <AlertCircle size={15} color="#b91c1c" />
            {avatarError}
          </div>
        )}
      </div>

      {/* 3. Two-Column Information Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Personal Information Form */}
        <form onSubmit={handleSaveProfile} className="dash-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <User size={16} color="var(--blue-primary)" />
            Personal Information
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Refiya Seyifadin"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.825rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. rafiyaseyfedin@gmail.com"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.825rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+251 94 954 0860"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.825rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Department / Team
              </label>
              <input
                type="text"
                value={team}
                onChange={e => setTeam(e.target.value)}
                placeholder="Management"
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.825rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Account Role
              </label>
              <div style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: role === 'ADMIN' ? '#0284c7' : (role === 'PROJECT_MANAGER' ? '#2563eb' : '#16a34a')
              }}>
                {role === 'ADMIN' ? '👑 Super Admin' : (role === 'PROJECT_MANAGER' ? '💼 Project Manager' : '💻 Team Member')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-blue"
              style={{
                fontSize: '0.8rem',
                padding: '0.55rem 1.25rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite', marginRight: '0.35rem' }} />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save size={14} style={{ marginRight: '0.35rem' }} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Account Summary & Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Account Overview Card */}
          <div className="dash-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Shield size={16} color="var(--blue-primary)" />
              Account Security & Role
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #dbeafe'
              }}>
                <Shield size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                  {role === 'ADMIN' ? 'Super Administrator' : (role === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Full workspace management & configuration authority
                </span>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span style={{ color: '#64748b' }}>Account Status:</span>
                <strong style={{ color: '#16a34a' }}>● Active</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span style={{ color: '#64748b' }}>Team:</span>
                <strong style={{ color: '#0f172a' }}>{team || 'Management'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span style={{ color: '#64748b' }}>Authentication:</span>
                <strong style={{ color: '#0284c7' }}>Verified User</strong>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="dash-card" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', margin: 0 }}>
              Recent Activity
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
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
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Profile Updated</strong>
                  <p style={{ fontSize: '0.775rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                    Profile details & corporate credentials updated
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Just now</span>
                </div>
              </div>

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
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Logged in</strong>
                  <p style={{ fontSize: '0.775rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                    Session initiated as {role === 'ADMIN' ? 'Super Admin' : role}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Active session</span>
                </div>
              </div>

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
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'block' }}>Task Completed</strong>
                  <p style={{ fontSize: '0.775rem', color: '#334155', fontWeight: 500, margin: '0.15rem 0' }}>
                    Dashboard statistics & profile synchronization evaluated
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Today</span>
                </div>
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
