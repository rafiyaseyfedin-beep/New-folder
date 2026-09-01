import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { Layers, Shield, User, UserCheck } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { currentRole, setCurrentRole, users, currentUserId, setCurrentUserId } = useApp();

  const handleRoleChange = (role) => {
    setCurrentRole(role);
    // Find a matching user for the role
    const defaultUser = users.find(u => u.role === role);
    if (defaultUser) {
      setCurrentUserId(defaultUser.id);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }} className="day-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--sky-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', letterSpacing: '-0.03em' }}>
              Debo<span style={{ color: 'var(--sky-primary)' }}>Manage</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>
              {APP_CONFIG.organization}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {APP_CONFIG.navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: isActive ? 'var(--sky-primary)' : 'var(--text-body)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.925rem',
                  transition: 'var(--transition)',
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Interactive Role Switcher Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            background: 'var(--sky-light)',
            border: '1px solid var(--border-sky)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            fontWeight: 600
          }}>
            <Shield size={14} color="var(--sky-primary)" />
            <span style={{ color: 'var(--sky-primary)' }}>Role:</span>
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-black)',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ADMIN">Admin</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
