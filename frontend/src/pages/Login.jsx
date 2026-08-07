import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CalendarDays,
  ArrowUpRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Users,
  BarChart3,
} from 'lucide-react';
import { authAPI } from '../api';
import { useToast } from '../components/ToastContainer';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: import.meta.env.VITE_DEMO_EMAIL || '',
    password: import.meta.env.VITE_DEMO_PASSWORD || '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [particles, setParticles] = useState([]);
  const { showToast } = useToast();

  // Generate cosmic particles for background
  useEffect(() => {
    const particleCount = 60;
    const newParticles = [];
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const animDelay = Math.random() * 8;
      const animDuration = Math.random() * 6 + 4;
      const opacity = Math.random() * 0.6 + 0.2;
      const type = Math.random() > 0.7 ? 'gold' : Math.random() > 0.5 ? 'blue' : '';
      newParticles.push({
        id: i,
        size,
        posX,
        posY,
        animDelay,
        animDuration,
        opacity,
        type,
      });
    }
    setParticles(newParticles);
  }, []);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { level: 0, text: '', color: '' },
      { level: 1, text: 'Weak', color: 'var(--c-red-500)' },
      { level: 2, text: 'Fair', color: 'var(--c-amber-500)' },
      { level: 3, text: 'Good', color: 'var(--c-lime-500)' },
      { level: 4, text: 'Strong', color: 'var(--c-teal-500)' },
      { level: 5, text: 'Excellent', color: 'var(--c-indigo-500)' },
    ];
    return levels[score];
  };

  const pwdStrength = getPasswordStrength(form.password);

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (mode === 'register' && !form.name) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      let response;
      if (mode === 'register') {
        response = await authAPI.register(form.name, form.email, form.password);
        showToast('Account created successfully!', 'success');
      } else {
        response = await authAPI.login(form.email, form.password);
        showToast('Welcome back!', 'success');
      }
      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem('sms_accessToken', accessToken);
      localStorage.setItem('sms_refreshToken', refreshToken);
      if (rememberMe) {
        localStorage.setItem('sms_user', JSON.stringify(user));
      }
      onLogin(user);
    } catch (x) {
      const message = x.response?.data?.message || x.message;
      showToast(message, 'error');
      if (x.response?.status === 401) {
        setErrors({ password: 'Invalid email or password' });
      }
      if (x.response?.status === 409) {
        setErrors({ email: 'An account with this email already exists' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Cosmic Particles Background */}
      <div className="cosmic-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`cosmic-particle${p.type ? ' ' + p.type : ''}`}
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.posX + '%',
              top: p.posY + '%',
              opacity: p.opacity,
              animationDelay: p.animDelay + 's',
              animationDuration: p.animDuration + 's',
            }}
          />
        ))}
      </div>

      <div className="login-orb orb-one" />
      <div className="login-orb orb-two" />
      <div className="login-orb orb-three" />
      <div className="login-orb orb-four" />

      <div className="login-layout">
        <section className="login-intro">
          <div className="brand login-brand">
            <span className="logo">
              <GraduationCap size={28} />
            </span>
            <span>
              Campus<span className="accent">Flow</span>
            </span>
          </div>

          <span className="login-tag">
            <Sparkles size={14} />
            STUDENT MANAGEMENT SYSTEM
          </span>

          <h1>
            Manage student records <em className="text-gradient-cosmic">with confidence.</em>
          </h1>
          <p>
            A secure place for student records, courses, and attendance
            updates.
          </p>

          <div className="login-points">
            <span>
              <ShieldCheck size={20} /> Secure administrator access
            </span>
            <span>
              <CalendarDays size={20} /> Academic information in one place
            </span>
            <span>
              <BarChart3 size={20} /> Real-time data insights
            </span>
            <span>
              <Users size={20} /> 50+ demo students pre-loaded
            </span>
          </div>

          <div className="login-demo-hint">
            <small>
              <CheckCircle size={14} />
              Demo credentials are prefilled. Sign in to explore the dashboard.
            </small>
          </div>
        </section>

        <section className="login-card">
          <div className="logo">
            <GraduationCap size={28} />
          </div>
          <span className="eyebrow">
            {mode === 'login' ? 'ADMINISTRATOR PORTAL' : 'CREATE NEW ACCOUNT'}
          </span>
          <h2 className={mode === 'login' ? 'text-gradient-cosmic' : ''}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p>
            {mode === 'login'
              ? 'Sign in to continue to your workspace.'
              : 'Register to start managing your campus.'}
          </p>

          {/* Social Login Buttons */}
          <div className="social-login">
            <button
              type="button"
              className="social-btn google"
              onClick={() =>
                showToast('Google login coming soon!', 'info')
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 11.75c0-.75-.07-1.5-.2-2.24h-4.1v4.26h3.66c-.92 2.5-3.55 4.26-6.32 4.26-1.87 0-3.46-.62-4.67-1.68l-.77 1.2C7.06 19.28 9.77 21 12.9 21c3.24 0 5.95-2.19 6.94-5.15z"
                />
                <path
                  fill="currentColor"
                  d="M12.9 4.5c1.52 0 2.9.55 3.96 1.45l2.8-2.8C17.25 1.15 15.22 0 12.9 0 8.76 0 5.15 2.62 3.26 6.62l-.03.03C4.29 8.12 4.29 9.88 3.26 11.38l-.03.03C5.15 15.38 8.76 18 12.9 18c1.52 0 2.9-.55 3.96-1.45l2.8 2.8C17.25 22.85 15.22 24 12.9 24 7.33 24 2.85 19.52 2.85 14c0-.75.07-1.5.2-2.24h4.1z"
                />
              </svg>
              Sign in with Google
            </button>
            <button
              type="button"
              className="social-btn microsoft"
              onClick={() =>
                showToast('Microsoft login coming soon!', 'info')
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5.5 2h13c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-13C4.67 18 4 17.33 4 16.5V3.5C4 2.67 4.67 2 5.5 2zm13 1.5v13h-13v-13h13z"
                />
                <path
                  fill="currentColor"
                  d="M10.5 7h3v3h-3V7zm0 4h3v3h-3v-3zm0 4h3v3h-3v-3z"
                />
              </svg>
              Sign in with Microsoft
            </button>
          </div>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <form onSubmit={submit} noValidate>
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (errors.name)
                      setErrors({ ...errors, name: undefined });
                  }}
                  className={errors.name ? 'input-error' : ''}
                  placeholder="Jane Doe"
                />
                {errors.name && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email)
                    setErrors({ ...errors, email: undefined });
                }}
                className={errors.email ? 'input-error' : ''}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className={errors.password ? 'input-error' : ''}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {form.password && mode === 'register' && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className="strength-bar"
                        style={{
                          backgroundColor:
                            bar <= pwdStrength.level
                              ? pwdStrength.color
                              : 'var(--c-slate-200)',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: pwdStrength.color }}
                  >
                    {pwdStrength.text}
                  </span>
                </div>
              )}

              {errors.password && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="login-options">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              className="btn btn-primary wide"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowUpRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="login-toggle">
            <small>
              {mode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrors({});
                }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </a>
            </small>
          </div>

          <small className="login-note">
            By signing in, you agree to the CampusFlow Terms of Service.
          </small>
        </section>
      </div>
    </div>
  );
}
