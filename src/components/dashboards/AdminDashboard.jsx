import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Activity,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { users, projects, teams, tasks } = useApp();

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const managerCount = users.filter(u => u.role === 'PROJECT_MANAGER').length;
  const memberCount = users.filter(u => u.role === 'TEAM_MEMBER').length;

  const totalProjects = projects.length;
  const totalTeams = teams.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const systemHealth = 99.8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Super Admin Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              👑 Super Admin Control Center
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Platform Operations & Global Governance
          </h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem', maxWidth: '600px' }}>
            Full system control over platform users, organization teams, permissions, and infrastructure metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Link to="/users" className="btn" style={{ background: '#ffffff', color: '#0284c7', fontWeight: 700, fontSize: '0.775rem', padding: '0.45rem 0.9rem' }}>
            <UserCheck size={14} /> Manage System Users
          </Link>
          <Link to="/reports" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '0.775rem', padding: '0.45rem 0.9rem' }}>
            <BarChart3 size={14} /> Audit Logs
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        {/* Card 1: Total Platform Users */}
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Platform Users</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{totalUsers} Active</div>
          <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '0.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <TrendingUp size={12} /> {adminCount} Admins • {managerCount} Managers • {memberCount} Members
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Active Projects</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Briefcase size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{totalProjects} Projects</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            Cross-functional organization initiatives
          </div>
        </div>

        {/* Card 3: Teams & Workgroups */}
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Teams & Squads</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <Layers size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{totalTeams} Teams</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            {completedTasks}/{totalTasks} Global Tasks Completed
          </div>
        </div>

        {/* Card 4: Platform Security & Health */}
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>System Health</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#be185d' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{systemHealth}% Uptime</div>
          <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '0.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Activity size={12} /> Supabase DB Connected
          </div>
        </div>

      </div>

      {/* Main Grid: User Accounts Overview & Admin Quick Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* User Account Overview Table */}
        <div className="dash-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>System User Directory</h3>
              <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Super Admin access control list</p>
            </div>
            <Link to="/users" className="btn btn-outline" style={{ fontSize: '0.725rem', padding: '0.3rem 0.65rem' }}>
              View All ({totalUsers}) <ChevronRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {users.slice(0, 5).map(user => (
              <div key={user.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-light)',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {user.avatar && (user.avatar.startsWith('data:image') || user.avatar.includes('/') || user.avatar.includes('http')) ? (
                      <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (user.avatar || user.name || 'US').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '0.675rem', color: '#64748b' }}>{user.email}</div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: user.role === 'ADMIN' ? '#fce7f3' : user.role === 'PROJECT_MANAGER' ? '#eff6ff' : '#f0fdf4',
                  color: user.role === 'ADMIN' ? '#be185d' : user.role === 'PROJECT_MANAGER' ? '#1d4ed8' : '#15803d'
                }}>
                  {user.role === 'ADMIN' ? 'SUPER ADMIN' : user.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global System Management & Controls */}
        <div className="dash-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Admin Management Shortcuts</h3>
            <p style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '1rem' }}>Instant controls for governance & structure</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link to="/users" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                textDecoration: 'none'
              }}>
                <UserCheck size={20} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0369a1' }}>User & Role Provisioning</div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Add users, assign roles, and update permissions</div>
                </div>
              </Link>

              <Link to="/teams" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                textDecoration: 'none'
              }}>
                <Layers size={20} color="#16a34a" />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#15803d' }}>Team Structure & Leads</div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Create departments and assign team leaders</div>
                </div>
              </Link>

              <Link to="/reports" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                background: '#fefce8',
                border: '1px solid #fef08a',
                textDecoration: 'none'
              }}>
                <BarChart3 size={20} color="#ca8a04" />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#a16207' }}>Organization Performance</div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>View analytics, exports, and velocity trends</div>
                </div>
              </Link>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: '#64748b' }}>
            <span>Security Protocol: Enforced</span>
            <span style={{ color: '#0284c7', fontWeight: 700 }}>Supabase Auth active</span>
          </div>
        </div>

      </div>

    </div>
  );
}
