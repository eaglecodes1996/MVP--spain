import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadHistory } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const YEAR_LABELS = { '7': 'Year 7', '8': 'Year 8', '9': 'Year 9', '10': 'Year 10', '11': 'Year 11', '12': 'Year 12', '13': 'Year 13', university: 'University' };

function getStoredYear() {
  try {
    return localStorage.getItem('solvesnap_learn_year') || '';
  } catch {
    return '';
  }
}

export function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const [history] = useState(() => loadHistory());
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ avatarUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfile({ displayName: displayName.trim() || user?.name, phone: phone.trim(), bio: bio.trim() });
    setEditing(false);
  };

  const prefs = user?.preferences || { notifications: true, language: 'en', studyYear: '' };
  const setPref = (key, value) => updateProfile({ preferences: { ...prefs, [key]: value } });

  if (!user) return null;

  return (
    <div className="page-header account-page">
      <div className="sec-title">Account &amp; settings</div>

      {/* Profile card */}
      <div className="card account-card">
        <div className="card-title">Profile</div>
        <div className="profile-row">
          <div className="profile-avatar-wrap">
            <div
              role="button"
              tabIndex={0}
              className="profile-avatar"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <UserAvatar user={user} size={96} style={{ border: 'none', width: '100%', height: '100%' }} />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            <button type="button" className="btn-s" style={{ marginTop: 10, width: '100%' }} onClick={() => fileInputRef.current?.click()}>
              Upload photo
            </button>
          </div>
          <div className="profile-fields">
            <div className="account-field">
              <label>Display name</label>
              {editing ? (
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
              ) : (
                <span>{user.displayName || user.name}</span>
              )}
            </div>
            <div className="account-field">
              <label>Email</label>
              <span>{user.email || '—'}</span>
            </div>
            <div className="account-field">
              <label>Phone</label>
              {editing ? (
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
              ) : (
                <span>{user.phone || '—'}</span>
              )}
            </div>
            <div className="account-field">
              <label>Bio</label>
              {editing ? (
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio (optional)" rows={2} />
              ) : (
                <span>{user.bio || '—'}</span>
              )}
            </div>
            {editing ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="btn-p" onClick={handleSaveProfile}>Save</button>
                <button type="button" className="btn-s" onClick={() => { setEditing(false); setDisplayName(user.displayName ?? user.name); setPhone(user.phone ?? ''); setBio(user.bio ?? ''); }}>Cancel</button>
              </div>
            ) : (
              <button type="button" className="btn-s" style={{ marginTop: 8 }} onClick={() => setEditing(true)}>Edit profile</button>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card account-card">
        <div className="card-title">Preferences</div>
        <div className="account-list">
          <div className="account-list-item">
            <span>Email notifications</span>
            <label className="toggle">
              <input type="checkbox" checked={!!prefs.notifications} onChange={(e) => setPref('notifications', e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="account-list-item">
            <span>Language</span>
            <select value={prefs.language || 'en'} onChange={(e) => setPref('language', e.target.value)} className="account-select">
              {LANG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="account-list-item">
            <span>Study year</span>
            <span className="account-muted">{getStoredYear() ? YEAR_LABELS[getStoredYear()] || getStoredYear() : 'Not set'}</span>
            <Link to="/learn" className="account-link">Set on Learn</Link>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card account-card">
        <div className="card-title">Subscription</div>
        <div className="account-list">
          <div className="account-list-item">
            <span>Current plan</span>
            <span className="account-badge">Free</span>
          </div>
          <a href="#" className="btn-upgrade" onClick={(e) => e.preventDefault()} style={{ marginTop: 12 }}>
            ✦ Upgrade to Premium
          </a>
        </div>
      </div>

      {/* History & activity */}
      <div className="card account-card">
        <div className="card-title">History &amp; activity</div>
        <p className="account-desc">Your recent activity across the app.</p>
        {history.length === 0 ? (
          <p className="account-muted">No activity yet.</p>
        ) : (
          <ul className="account-history">
            {history.slice(0, 25).map((item) => (
              <li key={item.id}>
                <span className="account-history-icon">{item.type === 'chat' ? '💬' : item.type === 'forum' ? '📝' : '🆘'}</span>
                {item.text || item.title || 'Activity'} — {new Date(item.at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Security */}
      <div className="card account-card">
        <div className="card-title">Security</div>
        <div className="account-list">
          <div className="account-list-item">
            <span>Password</span>
            <button type="button" className="account-link-btn">Change password</button>
          </div>
        </div>
      </div>

      {/* Data & privacy */}
      <div className="card account-card">
        <div className="card-title">Data &amp; privacy</div>
        <div className="account-list">
          <div className="account-list-item">
            <span>Download my data</span>
            <button type="button" className="account-link-btn">Request export</button>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="card account-card">
        <div className="card-title">Help</div>
        <div className="account-list">
          <Link to="/support" className="account-list-item account-list-link">
            <span>Support &amp; FAQ</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Sign out */}
      <div className="card account-card">
        <button type="button" className="btn-s account-signout" onClick={logout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
