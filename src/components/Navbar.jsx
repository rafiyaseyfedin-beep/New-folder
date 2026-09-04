import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { Layers, Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { currentRole, setCurrentRole, users, setCurrentUserId, isAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleChange = (role) => {
    if (currentRole === 'ADMIN') {
      setCurrentRole(role);
      const defaultUser = users.find(u => u.role === role);
      if (defaultUser) {
        setCurrentUserId(defaultUser.id);
      }
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#ffffff', borderBottom: '1px solid var(--border-light)' }} className="day-nav">
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        padding: '0 1.25rem',
        maxWidth: '1280px',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        
        {/* Brand Logo */}
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--blue-primary, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Layers size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black, #0f172a)', letterSpacing: '-0.03em' }}>
              Debo<span style={{ color: 'var(--blue-primary, #0284c7)' }}>Manage</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', fontWeight: 600, marginTop: '-3px' }}>
              {APP_CONFIG.organization}
            </span>
          </div>
        </Link>

        {/* Right Aligned Navigation Group (Features, Teams & Tech, About, Contact + Sign In) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: 'auto' }}>
          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-links" style={{ display: 'flex', gap: '1.85rem', alignItems: 'center' }}>
            {(location.pathname === '/' || location.pathname === '/login' || !isAuthenticated ? APP_CONFIG.publicNavLinks : APP_CONFIG.navLinks).map((link) => {
              const isHash = link.path.startsWith('/#');
              const isActive = !isHash && location.pathname === link.path;
              
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      if (location.pathname === '/') {
                        const hash = link.path.replace('/#', '');
                        const el = document.getElementById(hash);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    style={{
                      color: 'var(--text-black, #0f172a)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '1.075rem',
                      transition: 'var(--transition)',
                    }}
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isActive ? 'var(--blue-primary, #0284c7)' : 'var(--text-black, #0f172a)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '1.075rem',
                    transition: 'var(--transition)',
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Interactive Controls / Login Button */}
          <div className="desktop-role-switcher" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {(location.pathname === '/' || location.pathname === '/login' || !isAuthenticated) ? (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '1.05rem', fontWeight: 800 }}>
                Sign In
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--blue-light, #e0f2fe)',
                  border: '1px solid var(--border-active, #bae6fd)',
                  borderRadius: 'var(--radius-md, 10px)',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}>
                  <Shield size={16} color="var(--blue-primary, #0284c7)" />
                  <span style={{ color: 'var(--blue-primary, #0284c7)' }}>Role:</span>
                  {currentRole === 'ADMIN' ? (
                    <select
                      value={currentRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-black, #0f172a)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="PROJECT_MANAGER">Project Manager</option>
                      <option value="TEAM_MEMBER">Team Member</option>
                    </select>
                  ) : (
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {currentRole === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
                    </span>
                  )}
                </div>
                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.95rem', fontWeight: 800 }}>
                  Workspace
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-hamburger-btn"
          type="button"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle Menu"
          style={{
            border: '1px solid var(--border-light, #e2e8f0)',
            background: '#ffffff',
            borderRadius: '8px',
            padding: '0.4rem',
            cursor: 'pointer',
            color: 'var(--text-black, #0f172a)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Mobile Collapsible Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light, #e2e8f0)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(location.pathname === '/' || location.pathname === '/login' || !isAuthenticated ? APP_CONFIG.publicNavLinks : APP_CONFIG.navLinks).map((link) => {
              const isHash = link.path.startsWith('/#');
              const isActive = !isHash && location.pathname === link.path;
              
              if (isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (location.pathname === '/') {
                        const hash = link.path.replace('/#', '');
                        const el = document.getElementById(hash);
                        if (el) {
                          e.preventDefault();
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    style={{
                      color: 'var(--text-black, #0f172a)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.4rem 0'
                    }}
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    color: isActive ? 'var(--blue-primary, #0284c7)' : 'var(--text-black, #0f172a)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem',
                    padding: '0.4rem 0'
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {(location.pathname === '/' || location.pathname === '/login' || !isAuthenticated) ? (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center', padding: '0.6rem', marginTop: '0.25rem' }}
            >
              Sign In
            </Link>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 0.85rem',
              background: 'var(--blue-light, #e0f2fe)',
              borderRadius: 'var(--radius-md, 10px)',
              marginTop: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary, #0284c7)' }}>
                <Shield size={16} /> Role:
              </div>
              {currentRole === 'ADMIN' ? (
                <select
                  value={currentRole}
                  onChange={(e) => {
                    handleRoleChange(e.target.value);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-active, #bae6fd)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.5rem',
                    color: 'var(--text-black, #0f172a)',
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
              ) : (
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                  {currentRole === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inline Media Query Styles for Navbar */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-links, .desktop-role-switcher {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}

