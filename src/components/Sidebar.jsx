import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { processAvatarFile } from '../utils/avatarHelper';
import { supabase } from '../utils/supabase';
import {
  LayoutDashboard,
  Briefcase,
  Users as UsersIcon,
  CheckSquare,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  UserCheck,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Camera,
  Loader2,
  X
} from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) {
  const { currentUser, currentRole, updateUser } = useApp();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compress and center-crop image to 256x256 square JPEG (~20KB)
      const optimizedDataUrl = await processAvatarFile(file, 256, 0.85);
      const activeId = currentUser?.id || 'u_active';

      await updateUser(activeId, {
        name: currentUser?.name || 'Refiya Seyifadin',
        email: currentUser?.email || 'rafiyaseyfedin@gmail.com',
        role: currentUser?.role || currentRole || 'ADMIN',
        team: currentUser?.team || 'Management',
        avatar: optimizedDataUrl
      });

      try {
        await supabase.auth.updateUser({
          data: { avatar: optimizedDataUrl }
        });
      } catch (authErr) {
        console.warn('Supabase auth avatar update notice:', authErr);
      }
    } catch (err) {
      console.error('Sidebar avatar upload failed:', err);
      alert(err.message || 'Failed to upload photo. Please try another image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Full Navigation List with All 9 Platform Pages
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase size={18} strokeWidth={2} /> },
    { name: 'Teams', path: '/teams', icon: <UsersIcon size={18} strokeWidth={2} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} strokeWidth={2} /> },
    { name: 'Users', path: '/users', icon: <UserCheck size={18} strokeWidth={2} />, roles: ['ADMIN'] },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={18} strokeWidth={2} /> },
    { name: 'Team Chat', path: '/chat', icon: <MessageSquare size={18} strokeWidth={2} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} strokeWidth={2} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={18} strokeWidth={2} />, badge: '2' },
    { name: 'Settings', path: '/settings', icon: <Settings size={18} strokeWidth={2} /> },
    { name: 'Logout', path: '/logout', icon: <LogOut size={18} strokeWidth={2} /> },
  ];

  const visibleNavItems = navItems.filter(item => !item.roles || item.roles.includes(currentRole));

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`} style={{
      background: '#ffffff',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 0.75rem',
      overflow: 'hidden'
    }}>
      
      {/* FIXED TOP HEADER & USER CARD BLOCK */}
      <div style={{ flexShrink: 0 }}>
        
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0.55rem 0.25rem' : '0.65rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          background: '#f8fafc',
          marginBottom: '0.85rem'
        }}>
          <NavLink to="/" onClick={closeMobile} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)'
            }}>
              <Layers size={18} strokeWidth={2.2} />
            </div>
            {!isCollapsed && (
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', display: 'block', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  Debo Manage
                </span>
                <span style={{ fontSize: '0.625rem', color: 'var(--blue-primary)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  Task Platform
                </span>
              </div>
            )}
          </NavLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={toggleCollapse}
              className="desktop-sidebar-toggle"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}
            >
              {isCollapsed ? <ChevronRight size={18} strokeWidth={2} /> : <ChevronLeft size={18} strokeWidth={2} />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={closeMobile}
              className="mobile-sidebar-close-btn"
              title="Close Sidebar"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626'
              }}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* User Profile Card at Top */}
        {!isCollapsed && (
          <div
            className="sidebar-user-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0.85rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              marginBottom: '0.85rem',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
              position: 'relative'
            }}
          >
            {/* Hidden File Input for Avatar Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handleAvatarFileChange}
              style={{ display: 'none' }}
            />

            {/* Clickable Avatar Circle ("At the T letter") */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
              title="Click here to upload your profile picture"
              style={{
                position: 'relative',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.35rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                cursor: 'pointer',
                border: '2px solid #ffffff',
                outline: isHoveringAvatar ? '2px solid #0284c7' : '2px solid #bae6fd',
                transition: 'all 0.2s ease',
                transform: isHoveringAvatar ? 'scale(1.06)' : 'scale(1)'
              }}
            >
              {currentUser?.avatar && (currentUser.avatar.startsWith('data:image') || currentUser.avatar.includes('/') || currentUser.avatar.includes('http')) ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                (currentUser?.avatar || 'RS').slice(0, 2).toUpperCase()
              )}

              {/* Uploading Spinner */}
              {isUploading ? (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Loader2 size={16} className="animate-spin" color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                /* Camera Icon on Hover */
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(2, 132, 199, 0.75)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isHoveringAvatar ? 1 : 0,
                  transition: 'opacity 0.15s ease',
                  color: '#ffffff'
                }}>
                  <Camera size={18} strokeWidth={2.2} />
                </div>
              )}

              {/* Camera Badge Overlay (visible when not hovering) */}
              {!isHoveringAvatar && !isUploading && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#0284c7',
                  border: '1.5px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <Camera size={10} strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Quick Helper Text */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.1rem 0.35rem',
                fontSize: '0.65rem',
                color: '#0284c7',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Camera size={11} /> Upload Photo
            </button>

            {/* User Info Links to Profile */}
            <NavLink
              to="/profile"
              onClick={closeMobile}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
            >
              <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                {currentUser?.name || 'Refiya Seyifadin'}
              </span>

              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 500, display: 'block', margin: '0.15rem 0 0.35rem' }}>
                {currentUser?.email || 'rafiyaseyfedin@gmail.com'}
              </span>

              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '4px',
                background: '#fce7f3',
                color: '#be185d'
              }}>
                {currentRole === 'ADMIN' ? 'Super Admin' : currentRole.replace('_', ' ')}
              </span>
            </NavLink>
          </div>
        )}

      </div>

      {/* MENU Category Subtitle */}
      {!isCollapsed && (
        <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', marginBottom: '0.45rem', paddingLeft: '0.35rem', textTransform: 'uppercase', flexShrink: 0 }}>
          MENU NAVIGATION
        </div>
      )}

      {/* SCROLLABLE MENU NAVIGATION AREA */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '0.15rem',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--border-light) transparent'
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              title={isCollapsed ? item.name : undefined}
              style={({ isActive }) => {
                const isLogout = item.path === '/logout';
                return {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '0.6rem 0.4rem' : '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 600,
                  color: isLogout ? '#dc2626' : (isActive ? 'var(--blue-primary)' : '#1e293b'),
                  background: isActive ? (isLogout ? '#fee2e2' : '#e0f2fe') : 'transparent',
                  borderLeft: isActive ? (isLogout ? '3px solid #dc2626' : '3px solid var(--blue-primary)') : '3px solid transparent',
                  transition: 'all 0.15s ease'
                };
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                {item.icon}
                {!isCollapsed && <span style={{ letterSpacing: '-0.01em' }}>{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span style={{
                  background: 'var(--red-alert)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '999px'
                }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar-toggle {
            display: none !important;
          }
          .mobile-sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>

    </aside>
  );
}

