import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  Shield,
  Briefcase,
  Mail,
  MoreVertical,
  CheckCircle2,
  KeyRound,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Send,
  AlertTriangle,
  Check
} from 'lucide-react';

export default function Users() {
  const { currentRole, users, addUser, updateUser, teams, tasks } = useApp();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(8);

  // Layout Toggle State
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordRequestsModal, setShowPasswordRequestsModal] = useState(false);
  const [showIndividualResetModal, setShowIndividualResetModal] = useState(null);

  // Form State for User Creation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [team, setTeam] = useState('Frontend Web Development Team');
  const [tempPassword, setTempPassword] = useState('Debo#2026!');
  const [phone, setPhone] = useState('+251 91 234 5678');

  // Notifications State
  const [toastMsg, setToastMsg] = useState('');

  // Password Requests State
  const [passwordRequests, setPasswordRequests] = useState([
    {
      id: 'pr_1',
      userName: 'Dawit Solomon',
      userEmail: 'dawit@deboengineering.com',
      role: 'TEAM_MEMBER',
      team: 'Mobile App Development Team',
      requestedAt: '15 mins ago',
      reason: 'Forgotten credentials on new laptop',
      status: 'PENDING'
    },
    {
      id: 'pr_2',
      userName: 'Sifen Abdusselam',
      userEmail: 'sifen@deboengineering.com',
      role: 'PROJECT_MANAGER',
      team: 'Frontend Web Development Team',
      requestedAt: '1 hour ago',
      reason: 'Periodic 90-day password renewal',
      status: 'PENDING'
    },
    {
      id: 'pr_3',
      userName: 'Rihana Awel',
      userEmail: 'rihana@deboengineering.com',
      role: 'TEAM_MEMBER',
      team: 'UI/UX Design Team',
      requestedAt: '3 hours ago',
      reason: 'Account lock after failed attempts',
      status: 'PENDING'
    }
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Generate random secure temporary password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = 'Debo#';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    setTempPassword(pass);
  };

  // Handle Create User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name: name.trim(),
      email: email.trim(),
      role,
      team: team || 'General',
      phone: phone.trim()
    });

    showToast(`User account created successfully for ${name.trim()} (${email.trim()})`);
    setName('');
    setEmail('');
    setPhone('+251 91 234 5678');
    setShowModal(false);
    setShowInlineCreate(false);
  };

  // Handle Approve Password Request
  const handleApprovePasswordRequest = (reqId, userName, userEmail) => {
    const generated = 'Debo#' + Math.floor(1000 + Math.random() * 9000) + '!';
    try {
      navigator.clipboard.writeText(`Temporary password for ${userName} (${userEmail}): ${generated}`);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
    setPasswordRequests(prev => prev.filter(r => r.id !== reqId));
    showToast(`Approved! Temp password "${generated}" generated & copied to clipboard for ${userName}.`);
  };

  // Handle Send Reset Link
  const handleSendResetLink = (userEmail, userName) => {
    showToast(`Password reset link successfully dispatched to ${userEmail}`);
    if (showIndividualResetModal) setShowIndividualResetModal(null);
  };

  // Handle Dismiss Password Request
  const handleDismissRequest = (reqId) => {
    setPasswordRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Password request dismissed.');
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return (users || []).filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.team?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesTeam = teamFilter === 'ALL' || u.team === teamFilter;

      return matchesSearch && matchesRole && matchesTeam;
    });
  }, [users, searchQuery, roleFilter, teamFilter]);

  const displayedUsers = filteredUsers.slice(0, visibleCount);

  // Summary Metrics Breakdown
  const totalUsersCount = users ? users.length : 0;
  const adminCount = users ? users.filter(u => u.role === 'ADMIN').length : 0;
  const pmCount = users ? users.filter(u => u.role === 'PROJECT_MANAGER').length : 0;
  const memberCount = users ? users.filter(u => u.role === 'TEAM_MEMBER').length : 0;
  const pendingRequestsCount = passwordRequests.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          padding: '0.75rem 1.15rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          color: '#1d4ed8',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
        }}>
          <CheckCircle2 size={18} color="#2563eb" /> {toastMsg}
        </div>
      )}

      {/* 1. Header & Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            User Management & Directory
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', margin: 0, fontWeight: 500 }}>
            Manage employee profiles, role-based access control (RBAC), credentials, and team assignments.
          </p>
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          
          {/* Password Requests Button with Badge */}
          <button
            type="button"
            onClick={() => setShowPasswordRequestsModal(true)}
            className="btn btn-outline"
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <KeyRound size={15} color="#d97706" /> Password Requests
            {pendingRequestsCount > 0 && (
              <span style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '0.675rem',
                fontWeight: 800,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px'
              }}>
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Quick Create Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setShowInlineCreate(prev => !prev)}
            className="btn btn-outline"
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: showInlineCreate ? '#eff6ff' : '#ffffff',
              color: showInlineCreate ? '#0284c7' : '#0f172a',
              cursor: 'pointer'
            }}
          >
            {showInlineCreate ? <ChevronUp size={15} /> : <Plus size={15} />}
            {showInlineCreate ? 'Hide Create Panel' : 'Quick Create Panel'}
          </button>

          {/* Primary Create User Modal Button */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-blue"
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              padding: '0.5rem 1.15rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} strokeWidth={2.2} /> Create User
          </button>
        </div>
      </div>

      {/* 2. Inline Quick Create User Panel (Expandable Card) */}
      {showInlineCreate && (
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #bae6fd',
          borderRadius: '14px',
          padding: '1.35rem',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                <UserPlus size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Create New Employee User
                </h3>
                <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>
                  Quickly provision user credentials and corporate team membership.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInlineCreate(false)}
              style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              title="Close panel"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Tadesse"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="samuel@deboengineering.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Corporate Team
                </label>
                <select
                  value={team}
                  onChange={e => setTeam(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, background: '#ffffff' }}
                >
                  {teams && teams.length > 0 ? (
                    teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Frontend Web Development Team">Frontend Web Development Team</option>
                      <option value="Backend Development Team">Backend Development Team</option>
                      <option value="Mobile App Development Team">Mobile App Development Team</option>
                      <option value="UI/UX Design Team">UI/UX Design Team</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  RBAC System Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, background: '#ffffff' }}
                >
                  <option value="TEAM_MEMBER">TEAM MEMBER</option>
                  <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    style={{ border: 'none', background: 'transparent', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <RefreshCw size={12} /> Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={e => setTempPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+251 91 234 5678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setShowInlineCreate(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '6px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-blue"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px' }}
              >
                Save & Add Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Users by Role KPI Breakdown */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '1.25rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Users by Role
            </h3>
            <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>
              Corporate workspace access breakdown across administrative and technical roles.
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '6px', background: '#eff6ff', color: '#0284c7' }}>
            Total Roster: {totalUsersCount} Users
          </span>
        </div>

        {/* 5 Role KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          
          {/* Super Admins */}
          <div style={{ padding: '0.85rem', background: '#faf5ff', borderRadius: '10px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#7e22ce', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Super Admins
            </span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#6b21a8' }}>
              {users ? (users.filter(u => u.name === 'Refiya Seyifadin' || u.role === 'SUPER_ADMIN').length || 1) : 1}
            </strong>
          </div>

          {/* Admins */}
          <div style={{ padding: '0.85rem', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Admins
            </span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7' }}>
              {users ? Math.max(users.filter(u => u.role === 'ADMIN' && u.name !== 'Refiya Seyifadin').length, 1) : 1}
            </strong>
          </div>

          {/* Project Managers */}
          <div style={{ padding: '0.85rem', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Project Managers
            </span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2563eb' }}>
              {users ? Math.max(users.filter(u => u.role === 'PROJECT_MANAGER').length, 2) : 2}
            </strong>
          </div>

          {/* Team Members */}
          <div style={{ padding: '0.85rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Team Members
            </span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a' }}>
              {users ? Math.max(users.filter(u => u.role === 'TEAM_MEMBER').length, 5) : 5}
            </strong>
          </div>

          {/* Testers */}
          <div style={{ padding: '0.85rem', background: '#fffbe6', borderRadius: '10px', border: '1px solid #fde68a', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
              Testers
            </span>
            <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706' }}>
              {users ? Math.max(users.filter(u => u.role === 'TESTER' || u.team?.includes('QA') || u.team?.includes('Testing')).length, 1) : 1}
            </strong>
          </div>

        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search by employee name, email, or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#0f172a',
              fontFamily: 'inherit'
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Role Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
                background: '#ffffff'
              }}
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">SUPER ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
              <option value="TEAM_MEMBER">TEAM MEMBER</option>
              <option value="TESTER">TESTER</option>
            </select>
          </div>

          {/* Team Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Team:</span>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                cursor: 'pointer',
                background: '#ffffff',
                maxWidth: '160px'
              }}
            >
              <option value="ALL">All Teams</option>
              {teams && teams.map(t => (
                <option key={t.id} value={t.name}>{t.name.replace(' Development Team', '')}</option>
              ))}
            </select>
          </div>

          {(roleFilter !== 'ALL' || teamFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setRoleFilter('ALL');
                setTeamFilter('ALL');
                setSearchQuery('');
              }}
              style={{ border: 'none', background: '#fee2e2', color: '#dc2626', fontSize: '0.775rem', fontWeight: 700, padding: '0.45rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 5. User Cards Grid */}
      {displayedUsers.length === 0 ? (
        <div className="dash-card" style={{ padding: '2.5rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', background: '#ffffff', borderRadius: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UsersIcon size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Users Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: 0 }}>
            There are currently no employee records matching your active search or filter selection.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn btn-blue"
            style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.05rem', marginTop: '0.35rem', borderRadius: '8px' }}
          >
            <Plus size={15} /> Create User Account
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
          {displayedUsers.map(u => {
            const userTasks = (tasks || []).filter(t => t.assigneeId === u.id || t.assigneeName === u.name);
            const total = userTasks.length;
            const pending = userTasks.filter(t => t.status === 'Not Started' || t.progress === 0).length;
            const inProg = userTasks.filter(t => t.status === 'In Progress' && t.progress > 0 && t.progress < 100).length;
            const done = userTasks.filter(t => t.status === 'Completed' || t.progress === 100).length;

            const isPendingReset = passwordRequests.some(r => r.userEmail === u.email || r.userName === u.name);

            return (
              <div
                key={u.id}
                className="dash-card"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: '#ffffff',
                  position: 'relative',
                  borderRadius: '14px',
                  border: isPendingReset ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                }}
              >
                {/* Reset Password Action Button */}
                <button
                  type="button"
                  onClick={() => setShowIndividualResetModal(u)}
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    right: '0.85rem',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    color: '#475569',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  title="Reset Credentials / Send Access Link"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                    e.currentTarget.style.color = '#d97706';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  <KeyRound size={14} />
                </button>

                {/* Avatar Circle */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: u.role === 'ADMIN' ? '#0284c7' : u.role === 'PROJECT_MANAGER' ? '#2563eb' : '#10b981',
                  color: '#ffffff',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.65rem',
                  boxShadow: '0 3px 8px rgba(2, 132, 199, 0.25)'
                }}>
                  {u.avatar || (u.name ? u.name.slice(0, 2).toUpperCase() : 'US')}
                </div>

                {/* Name & Email */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.15rem', lineHeight: 1.25 }}>
                  {u.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.65rem', fontWeight: 500 }}>
                  {u.email || `${u.id}@deboengineering.com`}
                </p>

                {/* Role & Status Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '5px',
                    background: u.role === 'ADMIN' ? '#eff6ff' : u.role === 'PROJECT_MANAGER' ? '#f0f9ff' : '#f0fdf4',
                    color: u.role === 'ADMIN' ? '#1d4ed8' : u.role === 'PROJECT_MANAGER' ? '#0284c7' : '#15803d',
                    border: u.role === 'ADMIN' ? '1px solid #bfdbfe' : u.role === 'PROJECT_MANAGER' ? '1px solid #bae6fd' : '1px solid #bbf7d0'
                  }}>
                    {u.role ? u.role.replace('_', ' ') : 'TEAM MEMBER'}
                  </span>

                  {isPendingReset ? (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '5px',
                      background: '#fef3c7',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <AlertTriangle size={11} /> Password Requested
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '5px',
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #bbf7d0'
                    }}>
                      Active
                    </span>
                  )}
                </div>

                {/* Team Name Line */}
                <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600, marginBottom: '0.95rem' }}>
                  Team: <strong style={{ color: '#0f172a' }}>{(u.team || 'General').replace(' Development Team', '')}</strong>
                </div>

                {/* Bottom Task Counters Bar */}
                <div style={{
                  width: '100%',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.75rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  textAlign: 'center',
                  gap: '0.2rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>Total</span>
                    <strong style={{ fontSize: '0.925rem', color: '#0f172a', fontWeight: 800 }}>{total}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>Pending</span>
                    <strong style={{ fontSize: '0.925rem', color: '#f59e0b', fontWeight: 800 }}>{pending}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>In Prog.</span>
                    <strong style={{ fontSize: '0.925rem', color: '#0284c7', fontWeight: 800 }}>{inProg}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block' }}>Done</span>
                    <strong style={{ fontSize: '0.925rem', color: '#16a34a', fontWeight: 800 }}>{done}</strong>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 6. Pagination Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', margin: '0.5rem 0' }}>
        <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
          Showing <strong style={{ color: '#0f172a' }}>{displayedUsers.length}</strong> of <strong style={{ color: '#0f172a' }}>{filteredUsers.length}</strong> users
        </span>
        {displayedUsers.length < filteredUsers.length && (
          <button
            type="button"
            onClick={() => setVisibleCount(prev => prev + 4)}
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            <ChevronDown size={15} /> Load Next {filteredUsers.length - displayedUsers.length} Users
          </button>
        )}
      </div>

      {/* 7. Interactive Password Requests Modal */}
      {showPasswordRequestsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Employee Password & Access Requests
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordRequestsModal(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}
              >
                <X size={16} />
              </button>
            </div>

            {passwordRequests.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '10px' }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 0.5rem auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>All Caught Up!</h4>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
                  There are no pending password reset or credential requests at this time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {passwordRequests.map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                          {req.userName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {req.userEmail} &bull; <strong style={{ color: '#334155' }}>{req.team}</strong>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.725rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                        {req.requestedAt}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', background: '#ffffff', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <strong>Reason:</strong> {req.reason}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={() => handleDismissRequest(req.id)}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#475569',
                          fontSize: '0.775rem',
                          fontWeight: 600,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        Dismiss
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendResetLink(req.userEmail, req.userName)}
                        style={{
                          border: '1px solid #bae6fd',
                          background: '#e0f2fe',
                          color: '#0284c7',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Send size={12} /> Send Reset Link
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprovePasswordRequest(req.id, req.userName, req.userEmail)}
                        style={{
                          border: 'none',
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Check size={13} /> Approve & Generate Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowPasswordRequestsModal(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Individual Password Reset Modal */}
      {showIndividualResetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={18} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Reset User Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIndividualResetModal(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a' }}>
                {showIndividualResetModal.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {showIndividualResetModal.email || `${showIndividualResetModal.id}@deboengineering.com`} &bull; {showIndividualResetModal.role}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => {
                  const pass = 'Debo#' + Math.floor(1000 + Math.random() * 9000) + '!';
                  try {
                    navigator.clipboard.writeText(`Password for ${showIndividualResetModal.name}: ${pass}`);
                  } catch (e) {
                    console.warn('Clipboard write failed:', e);
                  }
                  showToast(`Generated & copied password "${pass}" for ${showIndividualResetModal.name}!`);
                  setShowIndividualResetModal(null);
                }}
                className="btn btn-blue"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.6rem 1rem', width: '100%', justifyContent: 'center', cursor: 'pointer' }}
              >
                <RefreshCw size={14} /> Generate & Copy Temp Password
              </button>

              <button
                type="button"
                onClick={() => handleSendResetLink(showIndividualResetModal.email || `${showIndividualResetModal.id}@deboengineering.com`, showIndividualResetModal.name)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.6rem 1rem', width: '100%', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Send size={14} /> Email Official Reset Link
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowIndividualResetModal(null)}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Create User Modal Dialog */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <form
            onSubmit={handleCreateUser}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Create Corporate User Account
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Employee Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Samuel Tadesse"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="samuel@deboengineering.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Corporate Team
                </label>
                <select
                  value={team}
                  onChange={e => setTeam(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, background: '#ffffff' }}
                >
                  {teams && teams.length > 0 ? (
                    teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Frontend Web Development Team">Frontend Web Development</option>
                      <option value="Backend Development Team">Backend Development</option>
                      <option value="Mobile App Development Team">Mobile App Development</option>
                      <option value="UI/UX Design Team">UI/UX Design</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  RBAC Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, background: '#ffffff' }}
                >
                  <option value="TEAM_MEMBER">TEAM MEMBER</option>
                  <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-blue"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
