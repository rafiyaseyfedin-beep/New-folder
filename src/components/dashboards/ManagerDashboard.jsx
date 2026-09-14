import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  User,
  Calendar,
  Layers,
  ChevronDown,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
  const { projects, tasks, addTask, users, updateTaskProgress } = useApp();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(users[0]?.id || 'u1');

  const totalProjects = projects.length;
  const activeTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const projectCompletionRate = activeTasks > 0 ? Math.round((completedTasks / activeTasks) * 100) : 0;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      title: newTaskTitle,
      assigneeId: newTaskAssignee,
      projectId: projects[0]?.id || 'p1',
      priority: 'High',
      deadline: '2026-09-30'
    });
    setNewTaskTitle('');
    setShowTaskModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Project Manager Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💼 Project Manager Hub
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Project Execution & Task Allocation
          </h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem', maxWidth: '600px' }}>
            Monitor project velocity, delegate tasks to team members, and ensure on-time milestone delivery.
          </p>
        </div>

        <button onClick={() => setShowTaskModal(true)} className="btn" style={{ background: '#ffffff', color: '#1e40af', fontWeight: 700, fontSize: '0.775rem', padding: '0.5rem 1rem' }}>
          <Plus size={14} /> Assign New Task
        </button>
      </div>

      {/* Manager Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Managed Projects</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Briefcase size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{totalProjects} Active</div>
          <div style={{ fontSize: '0.7rem', color: '#047857', marginTop: '0.25rem', fontWeight: 600 }}>
            In-progress milestones
          </div>
        </div>

        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Project Velocity</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{projectCompletionRate}% Ratio</div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            {completedTasks} of {activeTasks} tasks completed
          </div>
        </div>

        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>In-Progress Tasks</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{inProgressTasks} Tasks</div>
          <div style={{ fontSize: '0.7rem', color: '#ea580c', marginTop: '0.25rem', fontWeight: 600 }}>
            Currently in development
          </div>
        </div>

      </div>

      {/* Project Status Cards Overview */}
      <div className="dash-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Active Projects Overview</h3>
            <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Milestones, deadlines & assigned leads</p>
          </div>
          <Link to="/projects" className="btn btn-outline" style={{ fontSize: '0.725rem', padding: '0.3rem 0.65rem' }}>
            All Projects ({projects.length}) <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {projects.map(proj => (
            <div key={proj.id} style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              background: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{proj.name}</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#dcfce7', color: '#15803d' }}>
                    {proj.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '0 0 0.65rem 0', lineHeight: 1.3 }}>
                  {proj.description || 'Project initiative with milestone tracking.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                <span>Lead: <strong>{proj.manager}</strong></span>
                <span>Deadline: {proj.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Delegation Grid */}
      <div className="dash-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Team Task Assignments</h3>
            <p style={{ fontSize: '0.725rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>Adjust progress and verify completion</p>
          </div>
          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '0.725rem', padding: '0.3rem 0.65rem' }}>
            Full Task Board <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {tasks.map(task => (
            <div key={task.id} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', background: '#ffffff' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>{task.title}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Assignee: <strong>{task.assigneeName || 'Sead Nejib'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <span>Progress</span>
                <span style={{ color: task.status === 'Completed' ? '#16a34a' : '#2563eb' }}>{task.progress || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress || 0}
                onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                className="custom-progress-slider"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <form onSubmit={handleCreateTask} className="dash-card" style={{ width: '90%', maxWidth: '400px', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.85rem', fontSize: '1rem', fontWeight: 800 }}>Assign New Task</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Implement Supabase database queries"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.775rem' }}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.3rem' }}>Assignee</label>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.775rem' }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-outline" style={{ fontSize: '0.75rem' }}>Cancel</button>
              <button type="submit" className="btn btn-blue" style={{ fontSize: '0.75rem' }}>Create Task</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
