import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, saveToken } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Both fields are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(formData);
      saveToken(data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>LMS</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue learning</p>
        </div>
        {error && <div style={styles.errorBox}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.target.style, styles.button)}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#FFFFFF',
  },
  inputFocus: {
    padding: '10px 14px',
    border: '1px solid #2563EB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: '4px',
    padding: '11px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    marginTop: '4px',
    padding: '11px',
    backgroundColor: '#1D4ED8',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
    cursor: 'not-allowed',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748B',
    marginTop: '24px',
    marginBottom: 0,
  },
  link: {
    color: '#2563EB',
    fontWeight: '500',
    textDecoration: 'none',
  },
};