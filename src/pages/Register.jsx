import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { Layers, User, Mail, Lock, Briefcase, Shield, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { addUser, setCurrentRole, setCurrentUserId } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Frontend Web Development Team');
  const [selectedRole, setSelectedRole] = useState('TEAM_MEMBER');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // 1. Supabase Authentication SignUp
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: selectedRole,
            team: selectedTeam,
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // 2. Compute Avatar initials
      const userAvatar = name
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'US';

      // 3. Directly Insert Record into Supabase public.users Table
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .insert([
          {
            auth_user_id: data.user?.id || null,
            name: name,
            email: email,
            role: selectedRole,
            team_name: selectedTeam,
            avatar: userAvatar
          }
        ])
        .select();

      if (dbError) {
        console.warn('Supabase DB Insert Warning:', dbError.message);
      } else {
        console.log('User saved to Supabase users table:', dbUser);
      }

      setSuccessMsg('Account registered successfully!');

      // Register user in local app state
      const createdId = dbUser?.[0]?.id || 'u' + Date.now();
      addUser({
        id: createdId,
        name,
        email,
        team: selectedTeam,
        role: selectedRole,
        avatar: userAvatar
      });

      setCurrentRole(selectedRole);
      setCurrentUserId(createdId);

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Supabase Registration Error:', err);
      addUser({
        name,
        email,
        team: selectedTeam,
        role: selectedRole
      });
      setCurrentRole(selectedRole);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="dash-card" style={{ width: '100%', maxWidth: '460px', padding: '2.25rem' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--blue-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}>
            <Layers size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-black)', letterSpacing: '-0.03em' }}>
            Create an Account
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Join Debo Engineering cross-functional teams
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            fontSize: '0.8rem',
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
            borderRadius: '8px',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            color: '#166534',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} color="#16a34a" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="e.g. Dawit Solomon"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.65rem 0.6rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  outline: 'none',
                  fontSize: '0.825rem'
                }}
              />
              <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
              Corporate Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="dawit@deboengineering.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.65rem 0.6rem 2.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  outline: 'none',
                  fontSize: '0.825rem'
                }}
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.65rem 0.6rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    outline: 'none',
                    fontSize: '0.825rem'
                  }}
                />
                <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.65rem 0.6rem 2.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    outline: 'none',
                    fontSize: '0.825rem'
                  }}
                />
                <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  outline: 'none',
                  fontSize: '0.775rem'
                }}
              >
                <option value="Frontend Web Development Team">Frontend Web Team</option>
                <option value="Backend Development Team">Backend Team</option>
                <option value="Mobile Application Development Team">Mobile App Team</option>
                <option value="UI/UX Design Team">UI/UX Design Team</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-black)' }}>
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  outline: 'none',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  color: 'var(--blue-primary)'
                }}
              >
                <option value="TEAM_MEMBER">TEAM MEMBER</option>
                <option value="PROJECT_MANAGER">PROJECT MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-body)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                style={{ accentColor: 'var(--blue-primary)' }}
              />
              I agree to the Debo Engineering Terms of Service & Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-blue"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Login Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue-primary)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in here
          </Link>
        </div>

      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
        &copy; 2026 <strong style={{ color: '#0f172a' }}>Debo Engineering.</strong> All rights reserved.
      </div>
    </div>
  );
}
