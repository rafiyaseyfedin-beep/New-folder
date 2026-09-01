import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Loader2,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Copy,
  Share2,
  Layers,
  X
} from 'lucide-react';

export default function Tasks() {
  const { currentRole, currentUser, tasks, updateTaskProgress, addTask, users, projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [exportScope, setExportScope] = useState('ALL'); // ALL, IN_PROGRESS, COMPLETED, HIGH_PRIORITY

  const [showModal, setShowModal] = useState(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState(false);
  const [exportNotification, setExportNotification] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [assigneeName, setAssigneeName] = useState(currentUser?.name || '');
  const [priority, setPriority] = useState('High');
  const [deadline, setDeadline] = useState('2026-09-30');

  const isTeamMember = currentRole === 'TEAM_MEMBER';

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const selectedUser = users.find(u => u.id === assigneeId);
      const assignedPersonName = selectedUser ? selectedUser.name : (assigneeName.trim() || currentUser?.name || 'Unassigned');
      const assignedTeam = selectedUser ? (selectedUser.team || selectedUser.team_name || 'General') : 'General';

      await addTask({
        title: title.trim(),
        description: description.trim(),
        projectId: projectId || null,
        assigneeId: assigneeId || null,
        assigneeName: assignedPersonName,
        team: assignedTeam,
        priority,
        deadline: deadline || '2026-09-30'
      });

      setTitle('');
      setDescription('');
      setShowModal(false);
      setTaskSuccessMsg(true);
      setTimeout(() => setTaskSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Task Creation Error:', err);
      alert('Failed to create task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter tasks
  const filteredTasks = (tasks || []).filter(t => {
    const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.assigneeName && t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.team && t.team.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTeam = filterTeam === 'ALL' || t.team === filterTeam;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesTeam && matchesStatus;
  });

  // Calculate scope for export
  const getExportData = () => {
    let list = filteredTasks;
    if (exportScope === 'IN_PROGRESS') {
      list = list.filter(t => t.status === 'In Progress');
    } else if (exportScope === 'COMPLETED') {
      list = list.filter(t => t.status === 'Completed' || t.progress === 100);
    } else if (exportScope === 'HIGH_PRIORITY') {
      list = list.filter(t => t.priority === 'High');
    }
    return list;
  };

  // Export to CSV
  const handleExportCSV = () => {
    const dataToExport = getExportData();
    if (dataToExport.length === 0) {
      alert('No tasks match the selected export scope to export.');
      return;
    }

    const headers = ['Task ID', 'Title', 'Assignee', 'Team', 'Priority', 'Status', 'Progress (%)', 'Deadline', 'Description'];
    const rows = dataToExport.map(t => [
      `"${t.id || ''}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.assigneeName || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(t.team || 'General').replace(/"/g, '""')}"`,
      `"${t.priority || 'Medium'}"`,
      `"${t.status || 'Not Started'}"`,
      `"${t.progress || 0}"`,
      `"${t.deadline || ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `debo-tasks-export-${exportScope.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification(`Successfully exported ${dataToExport.length} tasks to CSV.`);
    setTimeout(() => setExportNotification(''), 4000);
  };

  // Export to JSON
  const handleExportJSON = () => {
    const dataToExport = getExportData();
    if (dataToExport.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          organization: 'Debo Engineering',
          exportedAt: new Date().toISOString(),
          scope: exportScope,
          totalCount: dataToExport.length,
          tasks: dataToExport
        },
        null,
        2
      )
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `debo-tasks-${exportScope.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification(`Successfully exported ${dataToExport.length} tasks to JSON.`);
    setTimeout(() => setExportNotification(''), 4000);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  // Copy Task Summary to Clipboard
  const handleCopyToClipboard = () => {
    const dataToExport = getExportData();
    if (dataToExport.length === 0) return;

    const summaryText = [
      `--- DEBO ENGINEERING TASK REPORT (${new Date().toLocaleDateString()}) ---`,
      `Total Tasks: ${dataToExport.length}`,
      ...dataToExport.map((t, idx) => `${idx + 1}. [${t.status}] ${t.title} - ${t.assigneeName || 'Unassigned'} (${t.priority} Priority, ${t.progress || 0}% done, Due: ${t.deadline || 'N/A'})`)
    ].join('\n');

    navigator.clipboard.writeText(summaryText);
    setExportNotification(`Copied summary of ${dataToExport.length} tasks to clipboard!`);
    setTimeout(() => setExportNotification(''), 4000);
  };

  const totalCount = filteredTasks.length;
  const completedCount = filteredTasks.filter(t => t.status === 'Completed' || t.progress === 100).length;
  const inProgressCount = filteredTasks.filter(t => t.status === 'In Progress' && t.progress < 100).length;
  const avgProgress = totalCount > 0 ? Math.round(filteredTasks.reduce((a, b) => a + (b.progress || 0), 0) / totalCount) : 0;
  const exportTargetCount = getExportData().length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      
      {/* Toast Notifications */}
      {taskSuccessMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          color: '#15803d',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 6px rgba(22, 163, 74, 0.08)'
        }}>
          <CheckCircle2 size={18} color="#16a34a" /> Task successfully created and saved in the database!
        </div>
      )}

      {exportNotification && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          color: '#1d4ed8',
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)'
        }}>
          <CheckCircle2 size={18} color="#2563eb" /> {exportNotification}
        </div>
      )}

      {/* 1. Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {isTeamMember ? 'My Assigned Tasks & Progress Console' : 'Task Management & Execution'}
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', background: isTeamMember ? '#dcfce7' : '#eff6ff', color: isTeamMember ? '#15803d' : '#2563eb' }}>
              {isTeamMember ? 'Team Member Workspace' : 'PM / Admin Console'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, fontWeight: 500 }}>
            {isTeamMember
              ? `Logged in as ${currentUser?.name || 'Active User'}. Update completion percentage and execution status.`
              : 'Assign tasks to team members, monitor sprint velocity, and export task reports.'}
          </p>
        </div>

        <button
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
            gap: '0.4rem'
          }}
        >
          <Plus size={16} strokeWidth={2.2} /> Create & Assign Task
        </button>
      </div>

      {/* 2. Top Dedicated Export Layout Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.85rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
      }}>
        {/* Left Export Scope Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#f0fdf4',
            border: '1px solid #dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a'
          }}>
            <Download size={18} />
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
              Export Task Dataset
            </div>
            <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>
              Ready to export <strong style={{ color: '#0f172a' }}>{exportTargetCount}</strong> {exportTargetCount === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569' }}>Scope:</span>
            <select
              value={exportScope}
              onChange={(e) => setExportScope(e.target.value)}
              style={{
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Filtered Tasks ({filteredTasks.length})</option>
              <option value="IN_PROGRESS">Active / In Progress ({inProgressCount})</option>
              <option value="COMPLETED">Completed Tasks ({completedCount})</option>
              <option value="HIGH_PRIORITY">High Priority Only</option>
            </select>
          </div>
        </div>

        {/* Right Export Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            title="Download CSV spreadsheet file"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              border: '1px solid #bbf7d0',
              background: '#f0fdf4',
              color: '#15803d',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dcfce7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
          >
            <FileSpreadsheet size={15} color="#16a34a" /> CSV Excel
          </button>

          {/* JSON Export Button */}
          <button
            onClick={handleExportJSON}
            title="Download raw JSON data backup"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              border: '1px solid #fde68a',
              background: '#fefce8',
              color: '#b45309',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fefce8'}
          >
            <FileText size={15} color="#d97706" /> JSON Data
          </button>

          {/* Copy Summary Button */}
          <button
            onClick={handleCopyToClipboard}
            title="Copy text summary to clipboard"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <Copy size={14} color="#64748b" /> Copy Summary
          </button>

          {/* Print Report Button */}
          <button
            onClick={handlePrint}
            title="Print or Save PDF document"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              border: '1px solid #dbeafe',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
          >
            <Printer size={15} color="#2563eb" /> Print / PDF
          </button>
        </div>
      </div>

      {/* 3. Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        {/* Total Tasks */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
              {isTeamMember ? 'Assigned to Me' : 'Total Tasks'}
            </span>
            <CheckSquare size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {totalCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Tasks</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c2410c' }}>
              In Progress
            </span>
            <Clock size={18} color="#f97316" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ea580c', lineHeight: 1.1 }}>
            {inProgressCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c2410c' }}>Active</span>
          </div>
        </div>

        {/* Average Progress */}
        <div className="dash-card" style={{
          padding: '1.05rem 1.25rem',
          background: '#ffffff',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>
              Average Progress
            </span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.1 }}>
            {avgProgress}% <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#15803d' }}>Completed</span>
          </div>
        </div>

      </div>

      {/* 4. Search & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        padding: '0.65rem 1rem',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search tasks by title, assignee, or team..."
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
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.45rem 0.8rem',
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
            <option value="ALL">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* 5. Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="dash-card" style={{ padding: '2.5rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', background: '#ffffff', borderRadius: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileCheck2 size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Tasks Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: 0 }}>
            There are currently no tasks matching your filters. Create your first task to get started!
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.05rem', marginTop: '0.35rem', borderRadius: '8px' }}>
            <Plus size={15} /> Create First Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
          {filteredTasks.map(t => {
            const isCompleted = t.status === 'Completed' || t.progress === 100;
            const isInProgress = t.status === 'In Progress' && t.progress < 100;

            return (
              <div
                key={t.id}
                className="dash-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.3rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Priority & Status Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      background: t.priority === 'High' ? '#fef2f2' : t.priority === 'Medium' ? '#fff7ed' : '#f0fdf4',
                      color: t.priority === 'High' ? '#dc2626' : t.priority === 'Medium' ? '#ea580c' : '#16a34a',
                      border: t.priority === 'High' ? '1px solid #fecaca' : t.priority === 'Medium' ? '1px solid #fed7aa' : '1px solid #bbf7d0'
                    }}>
                      {t.priority} Priority
                    </span>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      background: isCompleted ? '#dcfce7' : isInProgress ? '#ffedd5' : '#f1f5f9',
                      color: isCompleted ? '#15803d' : isInProgress ? '#c2410c' : '#64748b',
                      border: isCompleted ? '1px solid #bbf7d0' : isInProgress ? '1px solid #fed7aa' : '1px solid #e2e8f0'
                    }}>
                      {t.status}
                    </span>
                  </div>

                  {/* Task Title & Description */}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {t.title}
                  </h3>

                  {t.description && (
                    <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                      {t.description}
                    </p>
                  )}

                  {/* Assignee & Deadline Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.95rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {t.assigneeName ? t.assigneeName.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{t.assigneeName || 'Unassigned'}</span>
                    </div>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <Calendar size={14} color="#0284c7" /> {t.deadline}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Interactive Slider */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <span style={{ color: '#475569' }}>Completion Progress</span>
                    <span style={{ color: isCompleted ? '#16a34a' : '#0284c7', fontWeight: 800 }}>{t.progress || 0}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={t.progress || 0}
                    onChange={(e) => updateTaskProgress(t.id, Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: isCompleted ? '#16a34a' : '#0284c7',
                      cursor: 'pointer',
                      marginBottom: '0.85rem'
                    }}
                  />

                  {/* Action Quick Buttons */}
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button
                      onClick={() => updateTaskProgress(t.id, 25, 'In Progress')}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      25% Started
                    </button>
                    <button
                      onClick={() => updateTaskProgress(t.id, 50, 'In Progress')}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      50% Halfway
                    </button>
                    <button
                      onClick={() => updateTaskProgress(t.id, 100, 'Completed')}
                      style={{
                        flex: 1,
                        padding: '0.4rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: 'none',
                        background: isCompleted ? '#15803d' : '#16a34a',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Check size={13} /> {isCompleted ? 'Done' : 'Done 100%'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 6. Modal Dialog for Task Assignment */}
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
            onSubmit={handleCreate}
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
                Create & Assign New Task
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Task Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Build REST API authentication routes"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  fontWeight: 500
                }}
              />
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Task Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Detailed instructions or specifications"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  fontWeight: 500,
                  resize: 'vertical'
                }}
              />
            </div>

            {projects && projects.length > 0 && (
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Associated Project
                </label>
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    background: '#ffffff'
                  }}
                >
                  <option value="">-- Select Project (Optional) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Assignee Name
              </label>
              {users && users.length > 0 ? (
                <select
                  value={assigneeId}
                  onChange={e => {
                    setAssigneeId(e.target.value);
                    const found = users.find(u => u.id === e.target.value);
                    if (found) setAssigneeName(found.name);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    background: '#ffffff'
                  }}
                >
                  <option value="">-- Select Assignee --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.team || u.role})</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Employee Name"
                  value={assigneeName}
                  onChange={e => setAssigneeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    background: '#ffffff'
                  }}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.85rem',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
                style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '6px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-blue"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Creating Task...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
