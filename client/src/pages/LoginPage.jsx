import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim(), password);
    navigate('/', { replace: true });
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim(), password);
    navigate('/', { replace: true });
  };

  return (
    <div className="pg-login pg-login-origin">
      <div className="login-box login-box-origin">
        <div className="logo-area">
          <div className="login-avatar">
            <span role="img" aria-label="tutor">👋</span>
          </div>
          <p className="login-badge">
            <span className="live-dot" /> FREE AI TUTOR • LIVE
          </p>
        </div>

        <h1 className="login-title login-title-origin">
          Snap It. <span className="hi">Ace It.</span>
        </h1>
        <p className="login-tagline">
          Point your camera at any homework and get a full step-by-step explanation — like a real tutor, instantly.
        </p>

        <form className="login-form" onSubmit={handleSignIn}>
          <div className="field">
            <label className="field-label">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="field">
            <div className="field-label-row">
              <label className="field-label">PASSWORD</label>
              <a href="#" className="login-forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn-green btn-signin">
            Sign In & Start Learning
            <span className="btn-arrow">→</span>
          </button>
        </form>

        <button type="button" className="btn-outline" onClick={handleCreateAccount}>
          <span className="btn-star">✦</span> Create Free Account
        </button>

        <p className="login-note login-note-origin">
          No credit card + Free plan available
        </p>
      </div>
    </div>
  );
}
