import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Mail,
  Bell,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  Shield,
  Briefcase,
  Laptop,
  LogOut,
  Check,
  Users,
  Clock,
  Calendar,
  Menu
} from 'lucide-react';

export default function Header({ toggleMobileSidebar }) {
  const { currentUser, currentRole, setCurrentRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Live real-time clock state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format live time: e.g. "12:39 PM"
  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Format live date: e.g. "Tuesday, Sep 1"
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Dynamic Header Title mapping based on current route
  const getPageTitle = (path) => {
    switch (path) {
      case '/':
      case '/dashboard':
        return currentRole === 'ADMIN' 
          ? 'Super Admin Dashboard' 
          : (currentRole === 'PROJECT_MANAGER' ? 'Project Manager Dashboard' : 'Team Member Dashboard');
      case '/projects':
        return 'Projects Management';
      case '/tasks':
        return 'Tasks & Progress Tracking';
      case '/teams':
        return 'Corporate Teams';
      case '/users':
        return 'User Directory';
      case '/reports':
        return 'Management Reports & Analytics';
      case '/notifications':
        return 'Notifications & Activity';
      case '/chat':
        return 'Team Collaboration Chat';
      case '/profile':
        return 'User Profile & Identity';
      case '/settings':
        return 'System & Account Settings';
      default:
        return 'Debo Project Workspace';
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTitle = getPageTitle(location.pathname);
  const userName = currentUser?.name || 'Refiya Seyifadin';
  const userEmail = currentUser?.email || 'rafiyaseyfedin@gmail.com';

  const roleLabel = currentRole === 'ADMIN'
    ? 'Super Admin'
    : (currentRole === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member');

  const handleRoleSelect = (role) => {
    setCurrentRole(role);
    setDropdownOpen(false);
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  return (
    <header className="top-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1.5rem',
      background: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Dynamic Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          type="button"
          className="mobile-sidebar-toggle-btn"
          onClick={toggleMobileSidebar}
          aria-label="Open Sidebar"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.4rem',
            cursor: 'pointer',
            marginRight: '0.65rem',
            color: '#0f172a'
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.1rem' }}>
            {currentTitle}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }} className="header-greeting-text">
            Hey welcome back, <strong style={{ color: 'var(--text-black)' }}>{userName}</strong> 🙏
          </p>
        </div>
      </div>

      {/* Clean Header Controls: Date/Time, Search & User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        
        {/* Live Date & Time Display */}
        <div className="header-clock-widget" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.35rem 0.85rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb'
          }}>
            <Clock size={16} />
          </div>
          <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
              {formattedTime}
            </div>
            <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Global Search Box */}
        <div className="search-input-box header-search-box" style={{ width: '200px' }}>
          <input type="text" placeholder="Search workspace..." />
          <Search size={14} color="var(--text-muted)" />
        </div>

        {/* Notifications Icon Button */}
        <Link to="/notifications" className="icon-btn" style={{ position: 'relative', textDecoration: 'none' }}>
          <Bell size={16} color="var(--text-black)" />
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--red-alert)'
          }} />
        </Link>

        {/* Interactive Profile & Role Dropdown Trigger */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: dropdownOpen ? '#f8fafc' : 'transparent',
              border: dropdownOpen ? '1px solid #cbd5e1' : '1px solid transparent',
              borderRadius: '8px',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Avatar Circle */}
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--blue-primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.2)',
              overflow: 'hidden'
            }}>
              {currentUser?.avatar && (currentUser.avatar.startsWith('data:image') || currentUser.avatar.includes('/') || currentUser.avatar.includes('http')) ? (
                <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                (currentUser?.avatar || 'RS').slice(0, 2).toUpperCase()
              )}
            </div>

            {/* User Name & Role Label */}
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a', display: 'block', lineHeight: 1.15 }}>
                {userName}
              </span>
              <span style={{
                fontSize: '0.675rem',
                color: currentRole === 'ADMIN' ? '#0284c7' : (currentRole === 'PROJECT_MANAGER' ? '#2563eb' : '#16a34a'),
                fontWeight: 700,
                display: 'block'
              }}>
                {roleLabel}
              </span>
            </div>

            {dropdownOpen ? (
              <ChevronUp size={15} color="#0f172a" />
            ) : (
              <ChevronDown size={15} color="#64748b" />
            )}
          </button>

          {/* User Profile & Role Switcher Popup Menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: '260px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}>
              {/* Profile Card Header */}
              <div style={{
                padding: '0.95rem 1rem',
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                  {userName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all', marginBottom: '0.35rem' }}>
                  {userEmail}
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: currentRole === 'ADMIN' ? '#e0f2fe' : (currentRole === 'PROJECT_MANAGER' ? '#eff6ff' : '#f0fdf4'),
                  color: currentRole === 'ADMIN' ? '#0284c7' : (currentRole === 'PROJECT_MANAGER' ? '#2563eb' : '#16a34a'),
                  display: 'inline-block'
                }}>
                  {currentRole === 'ADMIN' ? '👑 Super Admin' : (currentRole === 'PROJECT_MANAGER' ? '💼 Project Manager' : '💻 Team Member')}
                </span>
              </div>

              {/* Role Switcher Section */}
              <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', paddingLeft: '0.25rem' }}>
                  PREVIEW ROLE DASHBOARDS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('ADMIN')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: currentRole === 'ADMIN' ? '1px solid #bae6fd' : '1px solid transparent',
                      background: currentRole === 'ADMIN' ? '#f0f9ff' : 'transparent',
                      color: currentRole === 'ADMIN' ? '#0284c7' : '#334155',
                      fontSize: '0.8rem',
                      fontWeight: currentRole === 'ADMIN' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Shield size={14} color="#0284c7" /> Super Admin
                    </span>
                    {currentRole === 'ADMIN' && <Check size={14} color="#0284c7" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('PROJECT_MANAGER')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: currentRole === 'PROJECT_MANAGER' ? '1px solid #bfdbfe' : '1px solid transparent',
                      background: currentRole === 'PROJECT_MANAGER' ? '#eff6ff' : 'transparent',
                      color: currentRole === 'PROJECT_MANAGER' ? '#2563eb' : '#334155',
                      fontSize: '0.8rem',
                      fontWeight: currentRole === 'PROJECT_MANAGER' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Briefcase size={14} color="#2563eb" /> Project Manager
                    </span>
                    {currentRole === 'PROJECT_MANAGER' && <Check size={14} color="#2563eb" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSelect('TEAM_MEMBER')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      border: currentRole === 'TEAM_MEMBER' ? '1px solid #bbf7d0' : '1px solid transparent',
                      background: currentRole === 'TEAM_MEMBER' ? '#f0fdf4' : 'transparent',
                      color: currentRole === 'TEAM_MEMBER' ? '#16a34a' : '#334155',
                      fontSize: '0.8rem',
                      fontWeight: currentRole === 'TEAM_MEMBER' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Laptop size={14} color="#16a34a" /> Team Member
                    </span>
                    {currentRole === 'TEAM_MEMBER' && <Check size={14} color="#16a34a" />}
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ padding: '0.45rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                  className="dropdown-item"
                >
                  <User size={14} color="#64748b" /> User Profile
                </Link>

                {currentRole === 'ADMIN' && (
                  <Link
                    to="/users"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      color: '#334155',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                    className="dropdown-item"
                  >
                    <Users size={14} color="#64748b" /> User Directory
                  </Link>
                )}

                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    color: '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                  className="dropdown-item"
                >
                  <Settings size={14} color="#64748b" /> Account Settings
                </Link>
              </div>

              {/* Logout Link */}
              <div style={{ padding: '0.45rem 0.75rem', borderTop: '1px solid #f1f5f9', background: '#fffafb' }}>
                <Link
                  to="/logout"
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <LogOut size={14} color="#dc2626" /> Log Out
                </Link>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
