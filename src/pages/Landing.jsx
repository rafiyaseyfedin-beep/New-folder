import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Layers,
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  Briefcase,
  Smartphone,
  Code,
  Palette,
  BarChart2,
  Award,
  Globe,
  Mail,
  Phone,
  Sparkles,
  Zap,
  Clock,
  Sliders,
  Play,
  ChevronRight,
  LayoutDashboard,
  CheckSquare,
  Lock,
  Star,
  Check,
  Calendar,
  UserCheck,
  FileText,
  TrendingUp,
  PieChart,
  MessageSquare,
  Paperclip,
  AtSign,
  Activity,
  LineChart
} from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

// Hyper-Attractive 3D Tech Stack & Language Illustrations
import backendImg from '../assets/new_backend_dev_illustration_1787217591908.jpg';
import frontendImg from '../assets/new_frontend_dev_illustration_1787217631849.jpg';
import mobileImg from '../assets/new_mobile_dev_illustration_1787217672304.jpg';
import uiuxImg from '../assets/new_uiux_illustration_1787217751182.jpg';
import taskMgmtImg from '../assets/task_management_illustration_1787210153119.jpg';
import analyticsImg from '../assets/analytics_reports_illustration_1787210688515.jpg';
import { useApp } from '../context/AppContext';
import collabImg from '../assets/team_collaboration_illustration_1787211013523.jpg';

export default function Landing() {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('ADMIN');

  const roles = [
    {
      id: 'ADMIN',
      title: 'Administrator',
      role: 'ADMIN ROLE',
      icon: <Shield size={24} color="var(--blue-primary)" />,
      badge: 'Full Oversight',
      desc: 'Complete control over organization users, role assignments, and team structures.',
      capabilities: [
        'Manage users & RBAC system roles',
        'Create & manage corporate teams',
        'Global project oversight & reporting',
        'System audit & security preferences'
      ]
    },
    {
      id: 'PROJECT_MANAGER',
      title: 'Project Manager',
      role: 'PROJECT MANAGER',
      icon: <Briefcase size={24} color="var(--blue-primary)" />,
      badge: 'Execution Lead',
      desc: 'Plan project scopes, assign subtasks to engineers, and track deadline velocity.',
      capabilities: [
        'Create & manage corporate projects',
        'Create & assign tasks to employees',
        'Monitor real-time task completion',
        'Automated deadline & bottleneck alerts'
      ]
    },
    {
      id: 'TEAM_MEMBER',
      title: 'Team Member',
      role: 'TEAM MEMBER',
      icon: <Users size={24} color="var(--blue-primary)" />,
      badge: 'Task Executor',
      desc: 'Focus on assigned tasks, update percentage progress sliders, and mark task status.',
      capabilities: [
        'Personalized assigned task console',
        'Smooth 0% – 100% percentage slider',
        'One-click status updates (Started/Done)',
        'Real-time notifications & team chat'
      ]
    }
  ];

  const teams = [
    {
      name: 'Backend Development Team',
      tag: 'Node.js, Python & MySQL',
      desc: 'Scalable REST APIs, database schemas, JWT controllers, and microservice infrastructure.',
      image: backendImg,
      icon: <Code size={22} color="var(--blue-primary)" />,
      members: '2 Engineers (Elaaf Mohammed, Samuel Tadesse)'
    },
    {
      name: 'Frontend Web Development Team',
      desc: 'React 18, Vite, JavaScript, HTML5/CSS3, and compact Day Mode workspace UI.',
      image: frontendImg,
      icon: <Layers size={22} color="var(--blue-primary)" />,
      tag: 'React 18, Vite & JS',
      members: '2 Engineers (Dawit Solomon, Abebe Bekele)'
    },
    {
      name: 'Mobile Application Development Team',
      desc: 'React Native Expo, iOS Swift, and Android Kotlin task management mobile apps.',
      image: mobileImg,
      icon: <Smartphone size={22} color="var(--blue-primary)" />,
      tag: 'React Native & Expo',
      members: '1 Engineer (Tigist Haile)'
    }
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '3.5rem 1rem 2.5rem',
        background: 'radial-gradient(circle at 50% 0%, #e0f2fe 0%, #ffffff 70%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.45rem 1.25rem',
            borderRadius: '999px',
            background: '#ffffff',
            border: '1px solid var(--border-active)',
            color: 'var(--blue-primary)',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.1)',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <Sparkles size={16} color="var(--blue-primary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Debo Engineering Enterprise Task Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            color: 'var(--text-black)',
            maxWidth: '920px',
            margin: '0 auto 1.25rem'
          }}>
            Streamline Project & Task Execution for <span style={{ color: 'var(--blue-primary)' }}>Debo Engineering</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-body)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}>
            A unified, role-based project management system supporting real-time percentage progress sliders, cross-functional teams, and executive analytics.
          </p>
        </div>
      </section>

      {/* Main Section: Powerful Features for Modern Teams */}
      <section id="features" style={{ padding: '3rem 1.5rem 2.25rem', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>
              Powerful Features for Modern Teams
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', maxWidth: '620px', margin: '0 auto' }}>
              Everything you need to manage tasks and projects effectively
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

            {/* Card 1: Task Management */}
            <div className="dash-card" style={{
              padding: '1.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--blue-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue-primary)',
                  marginBottom: '1.15rem'
                }}>
                  <CheckSquare size={20} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                  Task Management
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.15rem', lineHeight: 1.45 }}>
                  Create, assign, and track tasks easily.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Create tasks with priorities
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Assign to team members
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Set deadlines and reminders
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Track progress in real-time
                  </li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '1.5rem' }}>
                <Link to="/tasks" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--blue-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Explore Task Console <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Card 2: Team Collaboration */}
            <div className="dash-card" style={{
              padding: '1.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--blue-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue-primary)',
                  marginBottom: '1.15rem'
                }}>
                  <Users size={20} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                  Team Collaboration
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.15rem', lineHeight: 1.45 }}>
                  Work together in real-time.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Team chat and comments
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> File sharing
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> @mentions and notifications
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Activity feed
                  </li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '1.5rem' }}>
                <Link to="/chat" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--blue-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Open Team Chat <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Card 3: Progress Analytics */}
            <div className="dash-card" style={{
              padding: '1.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--blue-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue-primary)',
                  marginBottom: '1.15rem'
                }}>
                  <BarChart2 size={20} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                  Progress Analytics
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.15rem', lineHeight: 1.45 }}>
                  Track performance with charts.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Visual progress tracking
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Performance metrics
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Burndown charts
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-black)', fontWeight: 500 }}>
                    <Check size={15} color="var(--blue-primary)" /> Custom reports
                  </li>
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.85rem', marginTop: '1.5rem' }}>
                <Link to="/reports" style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--blue-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  View Analytics Reports <ChevronRight size={15} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* About Debo Project Manager Section */}
      <section id="about" style={{ padding: '2.5rem 1.5rem 2.75rem', backgroundColor: 'var(--blue-primary)', color: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem', letterSpacing: '-0.03em' }}>
            About Debo Project Manager
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#ffffff',
            lineHeight: 1.6,
            maxWidth: '860px',
            margin: '0 auto',
            fontWeight: 400
          }}>
            Debo Project Manager is an end-to-end task and project management solution engineered to modernize how engineering teams collaborate and execute. By replacing disconnected spreadsheets, manual paperwork, and scattered chat channels with a unified digital workspace, we empower teams to deliver projects faster with complete clarity and accountability.
          </p>
        </div>
      </section>

      {/* Cross-Functional Teams & Technology Showcase */}
      <section id="teams" style={{ padding: '2rem 1.5rem 2.25rem', background: 'var(--bg-app)', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '1.15rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue-primary)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              TECH STACKS & LANGUAGES
            </span>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-black)', margin: 0 }}>
              Debo Engineering Department Technology Stacks
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
              Powered by Node.js, Python, React 18, Vite, React Native, and Expo.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {teams.map((t, idx) => (
              <div key={idx} className="dash-card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)' }}>

                {/* Brand New 3D Technology Illustration */}
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative', background: '#f8fafc' }}>
                  <img
                    src={t.image}
                    alt={t.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: 'var(--blue-primary)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {t.tag}
                  </span>
                </div>

                <div style={{ padding: '1.15rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-black)', marginBottom: '0.35rem' }}>
                      {t.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.45, marginBottom: '0.85rem' }}>
                      {t.desc}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Members: <strong style={{ color: 'var(--text-black)' }}>{t.members}</strong>
                    </span>
                    <Link to="/teams" style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--blue-primary)', textDecoration: 'none' }}>
                      View Team →
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Public Footer */}
      <footer id="contact" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', padding: '2.5rem 1.5rem 1.75rem', background: '#bae6fd', color: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            {/* Column 1: Brand & Tagline */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--blue-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
                    Debo <span style={{ color: 'var(--blue-primary)' }}>Project Manager</span>
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.35rem' }}>
                Built for modern team development
              </p>
              <p style={{ fontSize: '0.825rem', color: '#0f172a', lineHeight: 1.5, fontWeight: 500 }}>
                Plan, track, and collaborate in one workspace.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.95rem', fontSize: '0.95rem', fontWeight: 800 }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <a
                  href="#features"
                  style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                >
                  Features
                </a>
                <a
                  href="#about"
                  style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                >
                  About
                </a>
                <a
                  href="#contact"
                  style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.95rem', fontSize: '0.95rem', fontWeight: 800 }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                <p style={{ margin: 0 }}>Debo Engineering</p>
                <p style={{ margin: 0 }}>Task & Project Management</p>
                <p style={{ margin: 0 }}>In Pursuit of Service</p>
              </div>
            </div>

            {/* Column 4: Contact Info & Social Media */}
            <div>
              <h4 style={{ color: '#0f172a', marginBottom: '0.95rem', fontSize: '0.95rem', fontWeight: 800 }}>Contact Info</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, marginBottom: '1.25rem' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={14} color="var(--blue-primary)" /> Jimma, Oromia, Ethiopia
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="var(--blue-primary)" /> +251 94 954 0860
                </p>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="var(--blue-primary)" /> contact@deboengineering.com
                </p>
              </div>

              {/* Social Media Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1877F2',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0A66C2',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* Telegram */}
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" title="Telegram" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#229ED9',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.195 1.006.128.832.942z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.33 1.54-1.34 2.54-.04 1.17.6 2.33 1.62 2.87 1.05.58 2.39.55 3.42-.06.84-.49 1.37-1.4 1.43-2.37.06-3.8.02-7.6.03-11.4z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF0000',
                  textDecoration: 'none',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.825rem', color: '#0f172a', fontWeight: 600 }}>
            &copy; 2026 Debo Engineering. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
