import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', paddingBottom: '2rem' }}>
      
      {/* ADMIN SYSTEM STAT CARDS (4 Column Grid - Continuous Palette) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
        
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Registered Users</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>{totalUsers} Accounts</div>
          <div style={{ fontSize: '0.725rem', color: '#0284c7', fontWeight: 700 }}>
            👑 {adminCount} Admins • 💼 {managerCount} Managers • 💻 {memberCount} Members
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Projects</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Briefcase size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>{totalProjects} Projects</div>
          <div style={{ fontSize: '0.725rem', color: '#0284c7', fontWeight: 700 }}>
            Across {totalTeams} corporate departments
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Work Tasks</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Layers size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>{totalTasks} Tasks</div>
          <div style={{ fontSize: '0.725rem', color: '#0284c7', fontWeight: 700 }}>
            {completedTasks} tasks marked complete
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Platform Security</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0284c7', margin: '0.25rem 0' }}>{systemHealth}% Uptime</div>
          <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>
            Protected with Supabase Auth
          </div>
        </div>

      </div>

      {/* USER MANAGEMENT & ROLE ASSIGNMENT TABLE CARD */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>System User Directory & Role Assignment</h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Super Admin user governance table</p>
          </div>
          <Link to="/users" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}>
            Full User Management <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '0.75rem 1rem' }}>User Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Email Address</th>
                <th style={{ padding: '0.75rem 1rem' }}>Assigned System Role</th>
                <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      background: u.role === 'ADMIN' ? '#e0f2fe' : (u.role === 'PROJECT_MANAGER' ? '#f0f9ff' : '#f8fafc'),
                      color: u.role === 'ADMIN' ? '#0284c7' : (u.role === 'PROJECT_MANAGER' ? '#0369a1' : '#475569')
                    }}>
                      {u.role === 'ADMIN' ? 'SUPER ADMIN' : u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600 }}>{u.team || 'Management'}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <Link to="/users" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none', fontSize: '0.775rem' }}>
                      Edit User
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

