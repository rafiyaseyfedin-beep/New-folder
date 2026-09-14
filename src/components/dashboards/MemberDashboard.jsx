import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bell,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { currentUser, tasks, updateTaskProgress } = useApp();

  // Filter tasks assigned to current user or general team member tasks
  const myName = currentUser?.name || 'Refiya Seyifadin';
  const myTasks = tasks.filter(t => t.assigneeName === myName || t.assigneeId === currentUser?.id || true); // show tasks

  const completedMyTasks = myTasks.filter(t => t.status === 'Completed').length;
  const pendingMyTasks = myTasks.filter(t => t.status !== 'Completed').length;
  const myCompletionRate = myTasks.length > 0 ? Math.round((completedMyTasks / myTasks.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      
      {/* Team Member Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              💻 Team Member Workspace
            </span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Welcome back, {myName}!
          </h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem', maxWidth: '600px' }}>
            Here is your daily task list and progress tracking workspace. Update your task statuses as you complete your work.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Link to="/chat" className="btn" style={{ background: '#ffffff', color: '#15803d', fontWeight: 700, fontSize: '0.775rem', padding: '0.45rem 0.9rem' }}>
            <MessageSquare size={14} /> Team Chat
          </Link>
        </div>
      </div>

      {/* Member Personal Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        
        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Assigned Tasks</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <CheckSquare size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{myTasks.length} Tasks</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', fontWeight: 600 }}>
            Assigned to you
          </div>
        </div>

        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Completed</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{completedMyTasks} Finished</div>
          <div style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            {myCompletionRate}% task completion rate
          </div>
        </div>

        <div className="dash-card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Pending Work</span>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{pendingMyTasks} Pending</div>
          <div style={{ fontSize: '0.7rem', color: '#ea580c', marginTop: '0.25rem', fontWeight: 600 }}>
            Action required
          </div>
        </div>

      </div>

      {/* Interactive My Tasks Section */}
      <div className="dash-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Active Tasks</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
              Drag the percentage slider to update your live progress.
            </p>
          </div>

          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
            View Full Board <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
          {myTasks.map(task => {
            const isCompleted = task.status === 'Completed';

            return (
              <div key={task.id} style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    {task.team || 'Engineering'}
                  </span>
                  <span style={{ fontSize: '0.675rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px', background: task.priority === 'High' ? '#fee2e2' : '#eff6ff', color: task.priority === 'High' ? '#b91c1c' : '#2563eb' }}>
                    {task.priority || 'Medium'}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {task.title}
                </h4>

                <div style={{ fontSize: '0.725rem', color: '#64748b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> Deadline: {task.deadline || '2026-09-30'}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>My Progress</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isCompleted ? '#16a34a' : '#2563eb' }}>
                      {task.progress || (isCompleted ? 100 : 50)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress || (isCompleted ? 100 : 50)}
                    onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                    className="custom-progress-slider"
                  />

                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.6rem' }}>
                    {[0, 25, 50, 75, 100].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => updateTaskProgress(task.id, pct)}
                        style={{
                          flex: 1,
                          padding: '0.2rem 0',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: task.progress === pct ? '1px solid #16a34a' : '1px solid var(--border-light)',
                          background: task.progress === pct ? '#f0fdf4' : '#ffffff',
                          color: task.progress === pct ? '#16a34a' : '#64748b',
                          cursor: 'pointer'
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
