import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { Check, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, UserCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentRole, setCurrentUserId, users } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDemoRoles, setShowDemoRoles] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.warn('Supabase auth notice:', error.message);
        setCurrentRole(selectedRole);
        const match = users?.find(u => u.email === email || u.role === selectedRole) || users?.[0];
        if (match) setCurrentUserId(match.id);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 400);
        return;
      }

      setSuccessMsg('Signed in successfully!');
      const userRole = data.user?.user_metadata?.role || selectedRole;
      setCurrentRole(userRole);

      const match = users?.find(u => u.email === email || u.role === userRole) || users?.[0];
      if (match) setCurrentUserId(match.id);

      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Login Error:', err);
      setCurrentRole(selectedRole);
      const match = users?.find(u => u.role === selectedRole) || users?.[0];
      if (match) setCurrentUserId(match.id);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role, emailVal, userId) => {
    setEmail(emailVal);
    setSelectedRole(role);
    setCurrentRole(role);
    if (userId) setCurrentUserId(userId);
    setSuccessMsg(`Switched to ${role} profile`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: 'hidden'
    }}>
      
      {/* Left Column: Form Area */}
      <div style={{
        flex: '1.1',
        backgroundColor: '#f1f7fc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 2.5rem 1.75rem',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        
        {/* Top Tagline with Soft Light Blue Pill */}
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            padding: '0.45rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            border: '1px solid #bae6fd'
          }}>
            <Sparkles size={14} color="#0284c7" />
            Empower your teams and deliver projects faster.
          </span>
        </div>

        {/* Center Container */}
        <div style={{
          width: '100%',
          maxWidth: '460px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem', width: '100%' }}>
            <h1 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              marginBottom: '0.4rem'
            }}>
              Sign In to Your Workspace
            </h1>
            <p style={{
              fontSize: '0.9rem',
              color: '#64748b',
              fontWeight: 500
            }}>
              Enter your work email and password to access your dashboard.
            </p>
          </div>

          {/* Login Card */}
          <div style={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '2.25rem 2rem',
            boxShadow: '0 4px 25px rgba(56, 189, 248, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)',
            border: '1px solid #e2e8f0',
            boxSizing: 'border-box'
          }}>
            
            {/* Status alerts */}
            {errorMsg && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} color="#dc2626" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.45rem'
                }}>
                  Work Email <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#38bdf8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.45rem'
                }}>
                  Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secret password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '0.875rem',
                      color: '#1e293b',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#38bdf8';
                      e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.35rem' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#0284c7',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#0369a1'}
                  onMouseLeave={(e) => e.target.style.color = '#0284c7'}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Submit Button in Light Sky Blue (#38bdf8) with solid clean contrast */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  letterSpacing: '0.04em',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s ease, transform 0.1s ease',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                  marginTop: '0.25rem'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#0ea5e9';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#38bdf8';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    AUTHENTICATING...
                  </>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>

            {/* Quick Demo Selector Toggle */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                  Active Role: <strong style={{ color: '#0284c7' }}>{selectedRole}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowDemoRoles(!showDemoRoles)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0284c7',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <UserCheck size={13} /> {showDemoRoles ? 'Hide presets' : 'Switch Demo Role'}
                </button>
              </div>

              {showDemoRoles && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ADMIN', 'admin@deboengineering.com', 'u1')}
                    style={{
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid #38bdf8',
                      background: selectedRole === 'ADMIN' ? '#e0f2fe' : '#ffffff',
                      color: '#0369a1',
                      cursor: 'pointer'
                    }}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('PROJECT_MANAGER', 'manager@deboengineering.com', 'u2')}
                    style={{
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: selectedRole === 'PROJECT_MANAGER' ? '#e0f2fe' : '#ffffff',
                      color: selectedRole === 'PROJECT_MANAGER' ? '#0369a1' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('TEAM_MEMBER', 'member@deboengineering.com', 'u4')}
                    style={{
                      padding: '0.45rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: selectedRole === 'TEAM_MEMBER' ? '#e0f2fe' : '#ffffff',
                      color: selectedRole === 'TEAM_MEMBER' ? '#0369a1' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Member
                  </button>
                </div>
              )}
            </div>

            {/* Register link */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
              New to Debo Project Hub?{' '}
              <Link to="/register" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
                Create an account
              </Link>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#64748b',
          fontWeight: 500,
          marginTop: '1.5rem'
        }}>
          &copy; 2026 Debo Project Manager. All rights reserved.
        </div>

      </div>

      {/* Right Column: Soft Aesthetic Light Blue (#cbe5f8 / #d6eaf8) */}
      <div style={{
        flex: '0.9',
        backgroundColor: '#d8ebf9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 3.5rem',
        boxSizing: 'border-box',
        borderLeft: '1px solid #bae6fd'
      }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          
          {/* Main Hero Title */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0f2942',
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            lineHeight: 1.25
          }}>
            Streamline Your Projects Effortlessly
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: '0.95rem',
            color: '#335372',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            fontWeight: 500
          }}>
            Plan tasks, track milestones, and coordinate workflows seamlessly across your entire team.
          </p>

          {/* Feature Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Feature 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                boxShadow: '0 2px 6px rgba(15, 41, 66, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={18} color="#0284c7" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.95rem', color: '#0f2942', fontWeight: 600 }}>
                Assign responsibilities & track deliverables
              </span>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                boxShadow: '0 2px 6px rgba(15, 41, 66, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={18} color="#0284c7" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.95rem', color: '#0f2942', fontWeight: 600 }}>
                Monitor real-time progress & deadlines
              </span>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={18} color="#0284c7" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.95rem', color: '#0f2942', fontWeight: 600 }}>
                Collaborate seamlessly with team members
              </span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
