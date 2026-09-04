import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Plus,
  ChevronDown,
  Clock,
  ArrowRight,
  User,
  Calendar,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { currentRole, projects, tasks, updateTaskProgress, addTask, users } = useApp();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('u_sead');

  // Stats
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addTask({
      title: newTaskTitle,
      assigneeId: newTaskAssignee,
      projectId: projects[0]?.id || 'p1',
      priority: 'High',
      deadline: '2026-08-31'
    });
    setNewTaskTitle('');
    setShowTaskModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '100%', overflow: 'hidden' }}>
      
      {/* Top 3 Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        
        {/* Card 1: Total Projects */}
        <div className="dash-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={15} color="var(--blue-primary)" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-black)' }}>
                Total Projects
              </span>
            </div>
            <MoreVertical size={14} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)' }}>
              {totalProjects} Active
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.675rem',
              fontWeight: 700,
              color: '#047857',
              background: '#d1fae5',
              padding: '0.12rem 0.4rem',
              borderRadius: '999px'
            }}>
              <TrendingUp size={10} /> +12%
            </span>
          </div>
        </div>

        {/* Card 2: Tasks Completion Ratio */}
        <div className="dash-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={15} color="#f97316" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-black)' }}>
                Tasks Completion
              </span>
            </div>
            <MoreVertical size={14} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)' }}>
              {overallProgress}% Ratio
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.675rem',
              fontWeight: 700,
              color: '#b91c1c',
              background: '#fee2e2',
              padding: '0.12rem 0.4rem',
              borderRadius: '999px'
            }}>
              <TrendingDown size={10} /> {completedTasks}/{totalTasks}
            </span>
          </div>
        </div>

        {/* Card 3: In Progress Tasks */}
        <div className="dash-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={15} color="#10b981" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-black)' }}>
                In Progress Tasks
              </span>
            </div>
            <MoreVertical size={14} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)' }}>
              {inProgressTasks} Tasks
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.675rem',
              fontWeight: 700,
              color: 'var(--blue-primary)',
              background: 'var(--blue-light)',
              padding: '0.12rem 0.4rem',
              borderRadius: '999px'
            }}>
              Active
            </span>
          </div>
        </div>

      </div>

      {/* Monitoring Overview Card */}
      <div className="dash-card" style={{ padding: '0.85rem 1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-black)' }}>
              Monitoring Overview
            </h3>
            <div style={{ display: 'flex', gap: '0.65rem', fontSize: '0.7rem', marginTop: '0.15rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--blue-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                ● Project Velocity
              </span>
              <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                ● Planned Target
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.55rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: '#f8fafc',
              fontSize: '0.725rem',
              fontWeight: 600,
              color: 'var(--text-black)',
              cursor: 'pointer'
            }}>
              Monthly <ChevronDown size={11} color="var(--text-muted)" />
            </div>

            {(currentRole === 'ADMIN' || currentRole === 'PROJECT_MANAGER') && (
              <button onClick={() => setShowTaskModal(true)} className="btn btn-blue" style={{ fontSize: '0.725rem', padding: '0.3rem 0.65rem' }}>
                <Plus size={12} /> Assign Task
              </button>
            )}
          </div>
        </div>

        {/* SVG Chart Area */}
        <div style={{ position: 'relative', width: '100%', height: '135px', marginTop: '0.5rem' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 130" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            <line x1="0" y1="25" x2="500" y2="25" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="95" x2="500" y2="95" stroke="#f1f5f9" strokeWidth="1" />

            <path
              d="M 0,30 Q 60,65 120,35 T 240,30 T 360,65 T 500,100"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.75"
              strokeDasharray="3 3"
              opacity="0.6"
            />

            <path
              d="M 0,100 Q 50,55 100,75 T 200,30 T 300,85 T 400,40 T 500,12"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
            />

            <circle cx="240" cy="40" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          </svg>

          <div style={{
            position: 'absolute',
            top: '8px',
            left: '43%',
            background: 'var(--blue-primary)',
            color: '#ffffff',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.675rem',
            fontWeight: 800,
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}>
            May: 85% Completion Rate
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            fontSize: '0.675rem',
            fontWeight: 600,
            marginTop: '0.25rem',
            padding: '0 0.25rem'
          }}>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span style={{ color: 'var(--text-black)', fontWeight: 800 }}>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
          </div>
        </div>
      </div>

      {/* Redesigned Premium "Live Task Progress" Section */}
      <div className="dash-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-black)' }}>
                Live Task Progress
              </h3>
              <span style={{
                background: 'var(--blue-light)',
                color: 'var(--blue-primary)',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '999px'
              }}>
                {tasks.length} Tasks
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Interactive progress tracking with real-time percentage controls.
            </p>
          </div>

          <Link to="/tasks" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
            View All Tasks <ArrowRight size={13} />
          </Link>
        </div>

        {/* Task Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: '1rem' }}>
          {tasks.map(task => {
            const isCompleted = task.status === 'Completed';
            const assigneeUser = users?.find(u => u.name === task.assigneeName || u.id === task.assigneeId);
            const avatar = assigneeUser?.avatar;
            const assigneeName = task.assigneeName || assigneeUser?.name || 'Sead Nejib';
            const assigneeInitial = assigneeName.slice(0, 2).toUpperCase();

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
                
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    color: 'var(--blue-primary)',
                    background: 'var(--blue-light)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px'
                  }}>
                    {task.team || 'Frontend Web'}
                  </span>

                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    background: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#f3f4f6' : '#eff6ff',
                    color: task.priority === 'High' ? '#b91c1c' : task.priority === 'Medium' ? '#4b5563' : 'var(--blue-primary)'
                  }}>
                    {task.priority || 'Medium'}
                  </span>
                </div>

                {/* Title */}
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: 'var(--text-black)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}>
                  {task.title}
                </h4>

                {/* Assignee & Deadline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--blue-primary)',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      {avatar && (avatar.startsWith('data:image') || avatar.includes('/') || avatar.includes('http')) ? (
                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        assigneeInitial
                      )}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-black)' }}>{assigneeName}</span>
                  </div>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Aug 31'}
                  </span>
                </div>

                {/* Progress Bar & Slider Controls */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isCompleted ? '#047857' : 'var(--blue-primary)'
                    }}>
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

                  {/* Quick Preset Buttons */}
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
                          border: task.progress === pct ? '1px solid var(--blue-primary)' : '1px solid var(--border-light)',
                          background: task.progress === pct ? 'var(--blue-light)' : '#ffffff',
                          color: task.progress === pct ? 'var(--blue-primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
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

      {/* Modal */}
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
                placeholder="e.g. Develop Express authentication API"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-light)', outline: 'none', fontSize: '0.775rem' }}
              />
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
