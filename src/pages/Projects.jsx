import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Plus,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  FolderPlus,
  X,
  Layers,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { currentRole, currentUser, projects, tasks, addProject, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showModal, setShowModal] = useState(false);
  const [showInlineCreate, setShowInlineCreate] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [manager, setManager] = useState(currentUser?.name || 'Abebe Bekele');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [status, setStatus] = useState('In Progress');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await addProject({
        name: name.trim(),
        description: description.trim(),
        manager: manager || currentUser?.name || 'Unassigned',
        deadline: deadline || '2026-09-30',
        status: status || 'In Progress'
      });

      setName('');
      setDescription('');
      setShowModal(false);
      setShowInlineCreate(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Project creation error:', err);
      alert('Failed to create project: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter projects
  const filteredProjects = (projects || []).filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.manager?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableManagers = users && users.length > 0
    ? users.filter(u => u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN' || u.role === 'TEAM_MEMBER')
    : [];

  // Status counts
  const totalCount = projects ? projects.length : 0;
  const activeCount = projects ? projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length : 0;
  const planningCount = projects ? projects.filter(p => p.status === 'Planning').length : 0;
  const completedCount = projects ? projects.filter(p => p.status === 'Completed').length : 0;
  const onHoldCount = projects ? projects.filter(p => p.status === 'On Hold' || p.status === 'Paused').length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      
      {/* Success Notification */}
      {successMsg && (
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
          <CheckCircle2 size={18} color="#16a34a" /> Project successfully created and saved in the workspace database!
        </div>
      )}

      {/* 1. Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Projects
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', margin: 0, fontWeight: 500 }}>
            Track project lifecycle, engineering lead assignments, and milestone deliverables.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <button
            onClick={() => setShowInlineCreate(!showInlineCreate)}
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
              color: showInlineCreate ? '#0284c7' : '#0f172a'
            }}
          >
            {showInlineCreate ? <ChevronUp size={15} /> : <Plus size={15} />}
            {showInlineCreate ? 'Hide Create Panel' : 'Quick Create Panel'}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-blue"
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              padding: '0.5rem 1.05rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={16} strokeWidth={2.2} /> Create New Project
          </button>
        </div>
      </div>

      {/* 2. Inline Create Project Section (Expandable Direct Creation Card) */}
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
                <FolderPlus size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Create New Project
                </h3>
                <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500 }}>
                  Fill in the details below to add a new project immediately.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInlineCreate(false)}
              style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              title="Close panel"
            >
              <X size={14} />
            </button>
          </div>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AgriTech Smart Soil Scanner"
                  value={name}
                  onChange={e => setName(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Project Lead / Manager
                </label>
                {availableManagers.length > 0 ? (
                  <select
                    value={manager}
                    onChange={e => setManager(e.target.value)}
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
                    {availableManagers.map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role?.replace('_', ' ') || 'Member'})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Manager Name"
                    value={manager}
                    onChange={e => setManager(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
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
                  <option value="In Progress">In Progress</option>
                  <option value="Active">Active</option>
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Project Description *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Detailed project objectives, deliverables, and requirements"
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
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
                disabled={submitting}
                className="btn btn-blue"
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px' }}
              >
                {submitting ? 'Saving...' : 'Save & Publish Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Top Metric KPI Cards Row (5 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
        
        {/* Total */}
        <div className="dash-card" style={{
          padding: '1rem 1.15rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
              Total Projects
            </span>
            <Briefcase size={16} color="#0f172a" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {totalCount}
          </div>
        </div>

        {/* Active / In Progress */}
        <div className="dash-card" style={{
          padding: '1rem 1.15rem',
          background: '#ffffff',
          border: '1px solid #dbeafe',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>
              In Progress
            </span>
            <Clock size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1 }}>
            {activeCount}
          </div>
        </div>

        {/* Planning */}
        <div className="dash-card" style={{
          padding: '1rem 1.15rem',
          background: '#ffffff',
          border: '1px solid #fef3c7',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309' }}>
              Planning
            </span>
            <Layers size={16} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d97706', lineHeight: 1.1 }}>
            {planningCount}
          </div>
        </div>

        {/* Completed */}
        <div className="dash-card" style={{
          padding: '1rem 1.15rem',
          background: '#ffffff',
          border: '1px solid #dcfce7',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>
              Completed
            </span>
            <CheckCircle2 size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', lineHeight: 1.1 }}>
            {completedCount}
          </div>
        </div>

        {/* On Hold */}
        <div className="dash-card" style={{
          padding: '1rem 1.15rem',
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
              On Hold
            </span>
            <AlertCircle size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#64748b', lineHeight: 1.1 }}>
            {onHoldCount}
          </div>
        </div>

      </div>

      {/* 4. Search & Status Filter Bar */}
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
            placeholder="Search projects by name, description, or lead..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="In Progress">In Progress</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* 5. Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="dash-card" style={{ padding: '2.5rem 1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', background: '#ffffff', borderRadius: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FolderPlus size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Projects Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
            There are currently no active projects matching your search or filters. Create your first project to get started!
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.05rem', marginTop: '0.35rem', borderRadius: '8px' }}>
            <Plus size={15} /> Create First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
          {filteredProjects.map(proj => {
            const projTasks = tasks ? tasks.filter(t => t.projectId === proj.id) : [];
            const completedTaskCount = projTasks.filter(t => t.status === 'Completed').length;
            const progressPct = projTasks.length > 0 ? Math.round((completedTaskCount / projTasks.length) * 100) : (proj.status === 'Completed' ? 100 : 0);
            const isCompleted = proj.status === 'Completed' || progressPct === 100;

            const getStatusBadgeStyle = () => {
              if (isCompleted) return { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' };
              if (proj.status === 'Planning') return { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' };
              if (proj.status === 'On Hold') return { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
              return { background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' };
            };

            return (
              <div
                key={proj.id}
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
                {/* Card Header & Description */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      ...getStatusBadgeStyle()
                    }}>
                      {isCompleted ? 'Completed' : (proj.status || 'In Progress')}
                    </span>

                    <span style={{ fontSize: '0.775rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <Calendar size={13} color="#0284c7" /> Deadline: <strong style={{ color: '#0f172a' }}>{proj.deadline || '2026-09-30'}</strong>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.075rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.25 }}>
                    {proj.name}
                  </h3>
                  <p style={{ color: '#334155', fontSize: '0.825rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {proj.description || 'No description provided for this project.'}
                  </p>
                </div>

                {/* Manager Progress Tracking */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.4rem' }}>
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
                        {proj.manager ? proj.manager.slice(0, 2).toUpperCase() : 'PM'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 500 }}>
                        Project Lead: <strong style={{ color: '#0f172a', fontWeight: 700 }}>{proj.manager || 'Unassigned'}</strong>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#0369a1', background: '#eff6ff', border: '1px solid #dbeafe', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>
                      {projTasks.length} Tasks
                    </span>
                  </div>

                  {/* Subtask Progress Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <span style={{ color: '#475569' }}>Completion Velocity</span>
                    <span style={{ color: isCompleted ? '#16a34a' : '#0284c7', fontWeight: 800 }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.95rem' }}>
                    <div style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      background: isCompleted ? '#16a34a' : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>

                  {/* Manager Action Links */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
                      <strong style={{ color: '#0f172a' }}>{completedTaskCount}</strong> of <strong style={{ color: '#0f172a' }}>{projTasks.length}</strong> tasks completed
                    </span>
                    <Link
                      to="/tasks"
                      className="btn btn-blue"
                      style={{
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      Manage Tasks <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 6. Modal Dialog for Create Project */}
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
                Create & Assign New Project
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
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AgriTech Smart Soil Scanner"
                value={name}
                onChange={e => setName(e.target.value)}
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
                Project Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed project objectives, deliverables, and requirements"
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

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Project Lead / Manager
              </label>
              {availableManagers.length > 0 ? (
                <select
                  value={manager}
                  onChange={e => setManager(e.target.value)}
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
                  {availableManagers.map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.role?.replace('_', ' ') || 'Member'})</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Manager Name"
                  value={manager}
                  onChange={e => setManager(e.target.value)}
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

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                Target Deadline Date
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
                style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.5rem 1.15rem', borderRadius: '6px' }}
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
