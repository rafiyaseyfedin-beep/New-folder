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
  BarChart3,
  Users
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
      
      {/* PROJECT MANAGER BLUE HUB BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px rgba(37, 99, 235, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              💼 Project Manager Control Hub
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>
              Projects Milestone Execution & Workload Allocation
            </h1>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.35rem', maxWidth: '650px' }}>
              Track project deadlines, monitor team task completion velocity, and delegate new assignments.
            </p>
          </div>

          <button onClick={() => setShowTaskModal(true)} className="btn" style={{ background: '#ffffff', color: '#1e40af', fontWeight: 800, fontSize: '0.85rem', padding: '0.65rem 1.25rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Plus size={16} /> Assign Task to Team
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Projects</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', margin: '0.25rem 0' }}>{totalProjects} Projects</div>
          <div style={{ fontSize: '0.725rem', color: '#2563eb', fontWeight: 700 }}>Full team execution status</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>In-Progress Tasks</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ea580c', margin: '0.25rem 0' }}>{inProgressTasks} Tasks</div>
          <div style={{ fontSize: '0.725rem', color: '#d97706', fontWeight: 700 }}>Currently being worked on</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Completed Tasks</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', margin: '0.25rem 0' }}>{completedTasks} Finished</div>
          <div style={{ fontSize: '0.725rem', color: '#15803d', fontWeight: 700 }}>Out of {activeTasks} total tasks</div>
        </div>
      </div>

      {/* MANAGED PROJECTS KANBAN CARDS */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Active Managed Projects</h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Milestones, leads, and deadlines</p>
          </div>
          <Link to="/projects" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}>
            All Projects ({projects.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {projects.map(p => (
            <div key={p.id} style={{ padding: '1.1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{p.name}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#dcfce7', color: '#15803d' }}>
                  {p.status}
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                {p.description || 'Project initiative with team milestone tracking.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', paddingTop: '0.5rem', borderTop: '1px solid #cbd5e1' }}>
                <span>Lead: <strong>{p.manager}</strong></span>
                <span>Due: {p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TASK DELEGATION BOARD */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Team Task Delegation & Progress Control</h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Adjust progress percentages for team members</p>
          </div>
          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}>
            Open Task Board <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {tasks.map(t => (
            <div key={t.id} style={{ padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>{t.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.65rem' }}>
                Assigned to: <strong>{t.assigneeName || 'Sead Nejib'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                <span>Completion Status</span>
                <span style={{ color: t.status === 'Completed' ? '#16a34a' : '#2563eb' }}>{t.progress || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={t.progress || 0}
                onChange={(e) => updateTaskProgress(t.id, parseInt(e.target.value))}
                className="custom-progress-slider"
              />
            </div>
          ))}
        </div>
      </div>

      {/* TASK MODAL */}
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
          <form onSubmit={handleCreateTask} style={{ background: '#ffffff', borderRadius: '12px', width: '90%', maxWidth: '420px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Assign New Task</h3>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.3rem', color: '#334155' }}>Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Optimize React components and API endpoints"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.8rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.3rem', color: '#334155' }}>Assignee</label>
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn btn-blue" style={{ fontSize: '0.8rem' }}>Assign Task</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
