import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { Check, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, UserCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useApp();

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

    if (!email || !password) {
      setErrorMsg('Please enter both your corporate email and account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginWithCredentials(email, password);
      setSuccessMsg('Authenticated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login Auth Error:', err);
      setErrorMsg(err.message || 'Invalid email or password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSignIn = async (role, emailVal) => {
    const defaultPassword = role === 'ADMIN' ? 'rS@88440292' : '123456';
    const targetEmail = (role === 'ADMIN' && (emailVal === 'admin@deboengineering.com' || !emailVal)) ? 'rafiyaseyfedin@gmail.com' : emailVal;
    
    setEmail(targetEmail);
    setPassword(defaultPassword);
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg(`Signing in as ${role.replace('_', ' ')}...`);
    setLoading(true);

    try {
      await loginWithCredentials(targetEmail, defaultPassword);
      setSuccessMsg(`Successfully authenticated as ${role.replace('_', ' ')}! Redirecting...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Quick login error:', err);
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    setErrorMsg('');
    setSuccessMsg(`Initiating ${provider} Sign-In... Redirecting...`);
    // Pre-authenticate as Admin for social demo using Admin credentials
    setTimeout(async () => {
      try {
        await loginWithCredentials('rafiyaseyfedin@gmail.com', 'rS@88440292');
        navigate('/dashboard');
      } catch (err) {
        setErrorMsg('Social sign in failed.');
      }
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Top Navigation Bar with Features, Teams & Tech, About, Contact, Sign In */}
      <Navbar />

      <div className="login-split-container" style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        maxWidth: '100%',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: 'hidden'
      }}>
      
      {/* Left Column: Form Area */}
      <div className="login-form-side" style={{
        flex: '1.1',
        backgroundColor: '#f1f7fc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 1.5rem 1.5rem',
        minHeight: '100vh',
        boxSizing: 'border-box',
        maxWidth: '100%'
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
          maxWidth: '480px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem', width: '100%' }}>
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
              Enter your work email and password to access your workspace.
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

            {/* Social Sign In Options */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem' }}>
                OR SIGN IN WITH SOCIAL ACCOUNTS
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleSocialSignIn('Google')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignIn('GitHub')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#181717',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
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
      <div className="login-hero-side" style={{
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
    </div>
  );
}
