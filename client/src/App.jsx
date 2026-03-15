import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { UserAvatar } from './components/UserAvatar';
import { HomePage } from './pages/HomePage';
import { ForumPage } from './pages/ForumPage';
import { SupportPage } from './pages/SupportPage';
import { LearnPage } from './pages/LearnPage';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isLearn = location.pathname === '/learn';

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="tb-name">SolveSnap AI</NavLink>
        <nav className="nav-top">
          {isLearn && (
            <a href="#" className="btn-upgrade" onClick={(e) => e.preventDefault()} style={{ marginRight: 8 }}>
              ✦ Upgrade
            </a>
          )}
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <span className="ico">🏠</span> Home
          </NavLink>
          <NavLink to="/forum" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="ico">💬</span> Forum
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="ico">📚</span> Learn
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="ico">🆘</span> Support
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title="Account">
            <UserAvatar user={user} size={28} />
            <span>Account</span>
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:postId" element={<ForumPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
