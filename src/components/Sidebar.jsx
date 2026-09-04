import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  X
} from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, closeMobile }) {
  const { currentUser, currentRole } = useApp();

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
          <NavLink
            to="/profile"
            onClick={closeMobile}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0.75rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              marginBottom: '0.85rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--blue-primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.35rem',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)',
              overflow: 'hidden'
            }}>
              {currentUser?.avatar && (currentUser.avatar.startsWith('data:image') || currentUser.avatar.includes('/') || currentUser.avatar.includes('http')) ? (
                <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                (currentUser?.avatar || 'EM').slice(0, 2).toUpperCase()
              )}
            </div>

            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
              {currentUser?.name || 'Refiya Seyifadin'}
            </span>

            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 500, display: 'block', marginBottom: '0.35rem' }}>
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

