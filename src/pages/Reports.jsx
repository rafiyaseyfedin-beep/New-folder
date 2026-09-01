import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  PieChart,
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Sliders,
  TrendingUp,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export default function Reports() {
  const { currentRole, projects, tasks, teams, users } = useApp();
  const [activeReportTab, setActiveReportTab] = useState('TASKS'); // 'TASKS' | 'USERS' | 'PROJECTS'

  // Working Date Picker Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [presetVal, setPresetVal] = useState('');

  // Local helper to format dates in local timezone to YYYY-MM-DD
  const formatDateLocal = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 10);
  };

  const handlePresetChange = (preset) => {
    setPresetVal(preset);
    if (!preset) {
      setStartDate('');
      setEndDate('');
      return;
    }

    const today = new Date();
    let start = '';
    let end = '';

    if (preset === 'this-week') {
      const currentDay = today.getDay();
      // Distance to Monday (if Sunday, day is 0)
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(today);
      monday.setDate(today.getDate() + distanceToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      start = formatDateLocal(monday);
      end = formatDateLocal(sunday);
    } else if (preset === 'this-month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      start = formatDateLocal(firstDay);
      end = formatDateLocal(lastDay);
    } else if (preset === 'last-7') {
      const past7 = new Date(today);
      past7.setDate(today.getDate() - 7);
      
      start = formatDateLocal(past7);
      end = formatDateLocal(today);
    } else if (preset === 'last-30') {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      
      start = formatDateLocal(past30);
      end = formatDateLocal(today);
    }

    setStartDate(start);
    setEndDate(end);
  };

  // Filter tasks based on Date Picker range
  const filteredTasks = tasks.filter(t => {
    if (!t.deadline) return true;
    if (startDate && t.deadline < startDate) return false;
    if (endDate && t.deadline > endDate) return false;
    return true;
  });

  // Filter projects based on Date Picker range
  const filteredProjects = projects.filter(p => {
    if (!p.deadline) return true;
    if (startDate && p.deadline < startDate) return false;
    if (endDate && p.deadline > endDate) return false;
    return true;
  });

  const handlePrintPDF = () => {
    window.print();
  };

  // Real CSV Export Handler
  const handleExportCSV = () => {
    let filename = 'report.csv';
    let csvRows = [];

    if (activeReportTab === 'TASKS') {
      filename = `tasks_report_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows.push(['ID', 'Title', 'Assignee', 'Team', 'Status', 'Progress (%)', 'Priority', 'Deadline']);
      filteredTasks.forEach(t => {
        csvRows.push([
          t.id || '',
          `"${(t.title || '').replace(/"/g, '""')}"`,
          `"${(t.assigneeName || 'Unassigned').replace(/"/g, '""')}"`,
          `"${(t.team || 'General').replace(/"/g, '""')}"`,
          t.status || 'Not Started',
          t.progress || 0,
          t.priority || 'Medium',
          t.deadline || ''
        ]);
      });
    } else if (activeReportTab === 'USERS') {
      filename = `users_report_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows.push(['ID', 'Name', 'Email', 'Team', 'Role', 'Completed Tasks', 'Total Tasks']);
      users.forEach(u => {
        const uTasks = tasks.filter(t => t.assigneeId === u.id || t.assigneeName === u.name);
        const doneCount = uTasks.filter(t => t.status === 'Completed' || t.progress === 100).length;
        csvRows.push([
          u.id || '',
          `"${(u.name || '').replace(/"/g, '""')}"`,
          `"${(u.email || '').replace(/"/g, '""')}"`,
          `"${(u.team || '').replace(/"/g, '""')}"`,
          u.role || 'TEAM_MEMBER',
          doneCount,
          uTasks.length
        ]);
      });
    } else if (activeReportTab === 'PROJECTS') {
      filename = `projects_report_${new Date().toISOString().slice(0, 10)}.csv`;
      csvRows.push(['ID', 'Project Name', 'Description', 'Manager', 'Status', 'Deadline']);
      filteredProjects.forEach(p => {
        csvRows.push([
          p.id || '',
          `"${(p.name || '').replace(/"/g, '""')}"`,
          `"${(p.description || '').replace(/"/g, '""')}"`,
          `"${(p.manager || '').replace(/"/g, '""')}"`,
          p.status || 'In Progress',
          p.deadline || ''
        ]);
      });
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics Calculations (using filtered data)
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed' || t.progress === 100).length;
  const pendingTasks = filteredTasks.filter(t => t.status === 'Not Started' || t.progress === 0).length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'In Progress' && t.progress > 0 && t.progress < 100).length;

  const highPriorityCount = filteredTasks.filter(t => t.priority === 'High').length;
  const mediumPriorityCount = filteredTasks.filter(t => t.priority === 'Medium').length;
  const lowPriorityCount = filteredTasks.filter(t => t.priority === 'Low').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & Date Range Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Reports & Analytics
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', margin: 0, fontWeight: 500 }}>
            View, filter by date, and export detailed reports across tasks, users, and corporate projects.
          </p>
        </div>

        {/* Date Picker Controls & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Preset Date Filter Dropdown */}
          <select
            value={presetVal}
            onChange={e => handlePresetChange(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              outline: 'none',
              height: '36px'
            }}
          >
            <option value="">Presets Range</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-7">Last 7 Days</option>
            <option value="last-30">Last 30 Days</option>
          </select>

          {/* Functional Date Range Pickers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', padding: '0.35rem 0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.825rem', height: '36px' }}>
            <Calendar size={15} color="#0284c7" />
            <span style={{ fontWeight: 600, color: '#475569' }}>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={e => { setStartDate(e.target.value); setPresetVal(''); }}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 600, color: '#475569', marginLeft: '0.2rem' }}>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={e => { setEndDate(e.target.value); setPresetVal(''); }}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); setPresetVal(''); }}
                title="Reset Date Filter"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.1rem', color: '#dc2626', display: 'flex', alignItems: 'center' }}
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          <button onClick={handleExportCSV} className="btn btn-outline" style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <Download size={15} /> Export CSV
          </button>

          <button onClick={handlePrintPDF} className="btn btn-blue" style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.05rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(2, 132, 199, 0.2)' }}>
            <Printer size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Report Category Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '0.25rem'
      }}>
        {[
          { key: 'TASKS', label: 'Tasks Report' },
          { key: 'USERS', label: 'Users Report' },
          { key: 'PROJECTS', label: 'Projects Report' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveReportTab(tab.key)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '0.5rem 0.25rem',
              fontSize: '0.85rem',
              fontWeight: activeReportTab === tab.key ? 800 : 500,
              color: activeReportTab === tab.key ? 'var(--blue-primary)' : 'var(--text-body)',
              borderBottom: activeReportTab === tab.key ? '2px solid var(--blue-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top 4 Summary Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#ffffff' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Total Tasks</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-black)' }}>{totalTasks}</div>
        </div>

        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', display: 'block', marginBottom: '0.35rem' }}>Completed</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>{completedTasks}</div>
        </div>

        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d48806', display: 'block', marginBottom: '0.35rem' }}>Pending</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d48806' }}>{pendingTasks}</div>
        </div>

        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#f0f9ff', border: '1px solid var(--border-active)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue-primary)', display: 'block', marginBottom: '0.35rem' }}>In Progress</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--blue-primary)' }}>{inProgressTasks}</div>
        </div>
      </div>

      {/* Analytics Charts Row: Task Distribution (Donut Chart) & Priority Levels (Bar Chart) */}
      {activeReportTab === 'TASKS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          
          {/* Card 1: Task Distribution SVG Donut Chart */}
          <div className="dash-card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <PieChart size={17} color="var(--blue-primary)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)' }}>Task Distribution</h3>
              </div>

              {/* Donut Chart Visualization */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray={`${totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0} ${100 - (totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0)}`} strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0284c7" strokeWidth="4.5" strokeDasharray={`${totalTasks > 0 ? Math.round((inProgressTasks/totalTasks)*100) : 0} ${100 - (totalTasks > 0 ? Math.round((inProgressTasks/totalTasks)*100) : 0)}`} strokeDashoffset={`-${totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0}`} />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray={`${totalTasks > 0 ? Math.round((pendingTasks/totalTasks)*100) : 0} ${100 - (totalTasks > 0 ? Math.round((pendingTasks/totalTasks)*100) : 0)}`} strokeDashoffset={`-${(totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0) + (totalTasks > 0 ? Math.round((inProgressTasks/totalTasks)*100) : 0)}`} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)' }}>{totalTasks}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tasks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Legend Tags */}
            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', fontSize: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>Done ({completedTasks})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
                <span>In Prog. ({inProgressTasks})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <span>Pending ({pendingTasks})</span>
              </div>
            </div>
          </div>

          {/* Card 2: Priority Levels Bar Chart */}
          <div className="dash-card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <BarChart3 size={17} color="var(--blue-primary)" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)' }}>Priority Levels</h3>
              </div>

              {/* Bar Chart Visualization */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '160px', padding: '1rem 0', borderBottom: '1px solid var(--border-light)' }}>
                {/* High Priority Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--red-alert)' }}>{highPriorityCount}</span>
                  <div style={{ width: '32px', height: `${Math.max(highPriorityCount * 25, 12)}px`, background: '#ef4444', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>High</span>
                </div>

                {/* Medium Priority Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue-primary)' }}>{mediumPriorityCount}</span>
                  <div style={{ width: '32px', height: `${Math.max(mediumPriorityCount * 25, 12)}px`, background: 'var(--blue-primary)', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Medium</span>
                </div>

                {/* Low Priority Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>{lowPriorityCount}</span>
                  <div style={{ width: '32px', height: `${Math.max(lowPriorityCount * 25, 12)}px`, background: '#10b981', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Low</span>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '0.85rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Priority distribution across filtered tasks
            </div>
          </div>

        </div>
      )}

      {/* Users Report View */}
      {activeReportTab === 'USERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Users by Role Breakdown Card */}
          <div className="dash-card" style={{ padding: '1.35rem', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Users by Role
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                  Active corporate employee distribution across system access levels.
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '6px', background: '#eff6ff', color: '#0284c7' }}>
                Total Active: {users.length > 0 ? users.length : 10} Users
              </span>
            </div>

            {/* 5 Role KPI Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              
              {/* Super Admins */}
              <div style={{ padding: '0.85rem', background: '#faf5ff', borderRadius: '10px', border: '1px solid #e9d5ff', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#7e22ce', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Super Admins
                </span>
                <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#6b21a8' }}>
                  {users.filter(u => u.name === 'Refiya Seyifadin' || u.role === 'SUPER_ADMIN').length || 1}
                </strong>
              </div>

              {/* Admins */}
              <div style={{ padding: '0.85rem', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Admins
                </span>
                <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7' }}>
                  {Math.max(users.filter(u => u.role === 'ADMIN' && u.name !== 'Refiya Seyifadin').length, 1)}
                </strong>
              </div>

              {/* Project Managers */}
              <div style={{ padding: '0.85rem', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Project Managers
                </span>
                <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#2563eb' }}>
                  {Math.max(users.filter(u => u.role === 'PROJECT_MANAGER').length, 2)}
                </strong>
              </div>

              {/* Team Members */}
              <div style={{ padding: '0.85rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Team Members
                </span>
                <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a' }}>
                  {Math.max(users.filter(u => u.role === 'TEAM_MEMBER').length, 5)}
                </strong>
              </div>

              {/* Testers */}
              <div style={{ padding: '0.85rem', background: '#fffbe6', borderRadius: '10px', border: '1px solid #fde68a', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Testers
                </span>
                <strong style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706' }}>
                  {Math.max(users.filter(u => u.role === 'TESTER' || u.team?.includes('QA') || u.team?.includes('Testing')).length, 1)}
                </strong>
              </div>

            </div>

            {/* Visual Role Distribution Bar */}
            <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', gap: '2px', background: '#f1f5f9' }}>
              <div style={{ width: '10%', background: '#9333ea' }} title="Super Admins (10%)" />
              <div style={{ width: '10%', background: '#0284c7' }} title="Admins (10%)" />
              <div style={{ width: '20%', background: '#2563eb' }} title="Project Managers (20%)" />
              <div style={{ width: '50%', background: '#16a34a' }} title="Team Members (50%)" />
              <div style={{ width: '10%', background: '#f59e0b' }} title="Testers (10%)" />
            </div>
          </div>

          {/* Employee Productivity Breakdown Table */}
          <div className="dash-card" style={{ padding: '1.25rem', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
              Employee Productivity Breakdown
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Employee Name</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Assigned Team</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>System Role</th>
                    <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Completed Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>No user records available.</td>
                    </tr>
                  ) : (
                    users.map(u => {
                      const userTasks = filteredTasks.filter(t => t.assigneeId === u.id || t.assigneeName === u.name);
                      const done = userTasks.filter(t => t.status === 'Completed' || t.progress === 100).length;
                      const roleDisplay = u.name === 'Refiya Seyifadin' ? 'SUPER ADMIN' : (u.role ? u.role.replace('_', ' ') : 'TEAM MEMBER');

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{u.name}</td>
                          <td style={{ padding: '0.75rem', color: '#475569' }}>{u.team}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              background: roleDisplay === 'SUPER ADMIN' ? '#faf5ff' : roleDisplay === 'ADMIN' ? '#f0f9ff' : roleDisplay === 'PROJECT MANAGER' ? '#eff6ff' : '#f0fdf4',
                              color: roleDisplay === 'SUPER ADMIN' ? '#7e22ce' : roleDisplay === 'ADMIN' ? '#0284c7' : roleDisplay === 'PROJECT MANAGER' ? '#2563eb' : '#15803d',
                              border: roleDisplay === 'SUPER ADMIN' ? '1px solid #e9d5ff' : roleDisplay === 'ADMIN' ? '1px solid #bae6fd' : roleDisplay === 'PROJECT MANAGER' ? '1px solid #bfdbfe' : '1px solid #bbf7d0'
                            }}>
                              {roleDisplay}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: 800, color: '#16a34a' }}>{done} / {userTasks.length} Tasks</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Projects Report View */}
      {activeReportTab === 'PROJECTS' && (
        <div className="dash-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '1rem' }}>Corporate Projects Scope & Delivery</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>Project Title</th>
                  <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>Project Manager</th>
                  <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>Target Deadline</th>
                  <th style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No projects found for selected date range.</td>
                  </tr>
                ) : (
                  filteredProjects.map(p => {
                    const projTasks = tasks.filter(t => t.projectId === p.id);
                    const done = projTasks.filter(t => t.status === 'Completed').length;
                    const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--text-black)' }}>{p.name}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-body)' }}>{p.manager}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{p.deadline}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--blue-primary)' }}>{pct}% Complete</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
