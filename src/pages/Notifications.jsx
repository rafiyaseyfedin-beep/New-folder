import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Check,
  Trash2,
  Filter,
  ArrowRight,
  Briefcase,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const [filterTab, setFilterTab] = useState('ALL');
  const [notificationList, setNotificationList] = useState([
    {
      id: 'notif-1',
      title: 'Project Milestone Achieved',
      message: 'Project "Debo Enterprise Task Platform V2" reached 85% completion milestone across active sprints.',
      type: 'PROJECT',
      time: 'Today at 12:45 PM',
      read: false
    },
    {
      id: 'notif-2',
      title: 'New Engineering Task Assigned',
      message: 'Task "UI/UX Design System Tokens & Component Library" assigned to Frontend Development Team.',
      type: 'TASK',
      time: 'Today at 11:30 AM',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Super Admin Access Verified',
      message: 'Refiya Seyifadin logged in with Super Admin executive privileges.',
      type: 'SYSTEM',
      time: 'Today at 09:15 AM',
      read: true
    },
    {
      id: 'notif-4',
      title: 'Sprint Deadline Alert',
      message: 'Backend REST API & JWT Authentication Controllers deadline is scheduled in 2 days.',
      type: 'TASK',
      time: 'Yesterday at 04:20 PM',
      read: true
    },
    {
      id: 'notif-5',
      title: 'Mobile Expo Build Published',
      message: 'Mobile Application Development Team deployed version 1.4.0 preview to test staging.',
      type: 'PROJECT',
      time: 'Yesterday at 02:10 PM',
      read: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch live notifications from Supabase if available
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(n => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'SYSTEM',
            time: new Date(n.created_at).toLocaleString(),
            read: n.read
          }));
          setNotificationList(mapped);
        }
      } catch (e) {
        console.warn('Failed to fetch notifications from Supabase:', e);
      }
    }

    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await supabase.from('notifications').update({ read: true }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) {
      console.warn('Failed to mark notifications read in Supabase:', e);
    }
  };

  const toggleRead = async (id) => {
    const target = notificationList.find(n => n.id === id);
    const newRead = target ? !target.read : true;
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, read: newRead } : n));

    try {
      await supabase.from('notifications').update({ read: newRead }).eq('id', id);
    } catch (e) {
      console.warn('Failed to update notification in Supabase:', e);
    }
  };

  const deleteNotification = async (id) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete notification in Supabase:', e);
    }
  };

  const filteredNotifications = notificationList.filter(n => {
    if (filterTab === 'UNREAD') return !n.read;
    if (filterTab === 'TASK') return n.type === 'TASK';
    if (filterTab === 'PROJECT') return n.type === 'PROJECT';
    return true;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '2rem' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Notifications & System Activity
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem', margin: 0, fontWeight: 500 }}>
            Real-time activity logs, task assignments, and project deadline alerts across Debo Engineering.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={markAllRead}
            className="btn btn-outline"
            style={{ fontSize: '0.825rem', fontWeight: 700, padding: '0.45rem 0.95rem', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Check size={14} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Total Notifications</span>
            <Bell size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>{notificationList.length}</div>
        </div>

        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c' }}>Unread Alerts</span>
            <AlertCircle size={16} color="#dc2626" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626' }}>{unreadCount} Unread</div>
        </div>

        <div className="dash-card" style={{ padding: '1rem 1.15rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803d' }}>Processed Actions</span>
            <CheckCircle2 size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a' }}>
            {notificationList.filter(n => n.read).length} Completed
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0.45rem 0.65rem',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '10px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'ALL', label: 'All Alerts' },
          { key: 'UNREAD', label: `Unread (${unreadCount})` },
          { key: 'PROJECT', label: 'Projects' },
          { key: 'TASK', label: 'Tasks' }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterTab(tab.key)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: filterTab === tab.key ? '#0284c7' : 'transparent',
              color: filterTab === tab.key ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List Body */}
      {loading ? (
        <div className="dash-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="dash-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Bell size={28} color="#0284c7" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No Notifications in this Category</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            System updates, task assignments, and project deadline alerts will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNotifications.map(n => (
            <div
              key={n.id}
              className="dash-card"
              style={{
                padding: '1.15rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                background: n.read ? '#ffffff' : '#f0f9ff',
                border: n.read ? '1px solid #e2e8f0' : '1px solid #bae6fd',
                borderLeft: n.read ? '1px solid #e2e8f0' : '4px solid #0284c7',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{
                  marginTop: '0.1rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: n.type === 'PROJECT' ? '#ffedd5' : n.type === 'TASK' ? '#eff6ff' : '#faf5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {n.type === 'TASK' ? (
                    <Clock size={16} color="#0284c7" />
                  ) : n.type === 'PROJECT' ? (
                    <Briefcase size={16} color="#ea580c" />
                  ) : (
                    <Bell size={16} color="#7e22ce" />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {n.title}
                    </h4>
                    <span style={{
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: n.type === 'PROJECT' ? '#fed7aa' : n.type === 'TASK' ? '#dbeafe' : '#f3e8ff',
                      color: n.type === 'PROJECT' ? '#c2410c' : n.type === 'TASK' ? '#1d4ed8' : '#6b21a8'
                    }}>
                      {n.type}
                    </span>
                    {!n.read && (
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>
                        NEW
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, marginBottom: '0.35rem', lineHeight: 1.45, fontWeight: 500 }}>
                    {n.message}
                  </p>

                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    {n.time}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => toggleRead(n.id)}
                  title={n.read ? 'Mark as Unread' : 'Mark as Read'}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <Check size={13} /> {n.read ? 'Read' : 'Mark Read'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteNotification(n.id)}
                  title="Delete Notification"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.35rem', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
