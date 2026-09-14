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
  ArrowRight,
  Sparkles,
  Smile
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { currentUser, tasks, updateTaskProgress } = useApp();

  const myName = currentUser?.name || 'Refiya Seyifadin';
  const myTasks = tasks.filter(t => t.assigneeName === myName || t.assigneeId === currentUser?.id || true);

  const completedMyTasks = myTasks.filter(t => t.status === 'Completed').length;
  const pendingMyTasks = myTasks.filter(t => t.status !== 'Completed').length;
  const myCompletionRate = myTasks.length > 0 ? Math.round((completedMyTasks / myTasks.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
      
      {/* TEAM MEMBER GREEN PERSONAL WORKSPACE BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px rgba(16, 185, 129, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              💻 My Personal Task Workspace
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>
              Welcome back, {myName}!
            </h1>
            <p style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '0.35rem', maxWidth: '650px' }}>
              Your personal daily task board. Drag sliders to update your progress and check off completed work.
            </p>
          </div>

          <Link to="/chat" className="btn" style={{ background: '#ffffff', color: '#059669', fontWeight: 800, fontSize: '0.85rem', padding: '0.65rem 1.25rem', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <MessageSquare size={16} /> Open Team Chat
          </Link>
        </div>
      </div>

      {/* MEMBER STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.1rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>My Assigned Tasks</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', margin: '0.25rem 0' }}>{myTasks.length} Tasks</div>
          <div style={{ fontSize: '0.725rem', color: '#10b981', fontWeight: 700 }}>Personal assigned workload</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Completed Tasks</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a', margin: '0.25rem 0' }}>{completedMyTasks} Done</div>
          <div style={{ fontSize: '0.725rem', color: '#15803d', fontWeight: 700 }}>{myCompletionRate}% completion rate</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pending Tasks</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706', margin: '0.25rem 0' }}>{pendingMyTasks} Remaining</div>
          <div style={{ fontSize: '0.725rem', color: '#b45309', fontWeight: 700 }}>Requires action</div>
        </div>
      </div>

      {/* MY INTERACTIVE TASK LIST */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>My Active Tasks & Daily Progress</h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>Use presets or drag the slider to update your progress</p>
          </div>
          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '0.775rem', padding: '0.4rem 0.85rem' }}>
            Full Board <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {myTasks.map(t => {
            const isCompleted = t.status === 'Completed';

            return (
              <div key={t.id} style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: '#ffffff',
                border: isCompleted ? '2px solid #bbf7d0' : '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                    {t.team || 'Engineering'}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', background: t.priority === 'High' ? '#fee2e2' : '#eff6ff', color: t.priority === 'High' ? '#b91c1c' : '#2563eb' }}>
                    {t.priority || 'Medium'} Priority
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {t.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Deadline: {t.deadline || '2026-09-30'}
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>My Task Progress</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: isCompleted ? '#16a34a' : '#2563eb' }}>
                      {t.progress || (isCompleted ? 100 : 50)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={t.progress || (isCompleted ? 100 : 50)}
                    onChange={(e) => updateTaskProgress(t.id, parseInt(e.target.value))}
                    className="custom-progress-slider"
                  />

                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.75rem' }}>
                    {[0, 25, 50, 75, 100].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => updateTaskProgress(t.id, pct)}
                        style={{
                          flex: 1,
                          padding: '0.25rem 0',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          borderRadius: '6px',
                          border: t.progress === pct ? '1px solid #059669' : '1px solid #cbd5e1',
                          background: t.progress === pct ? '#ecfdf5' : '#ffffff',
                          color: t.progress === pct ? '#059669' : '#64748b',
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
