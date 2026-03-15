import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'solvesnap_user';
const HISTORY_KEY = 'solvesnap_history';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryItem(item) {
  const list = loadHistory();
  list.unshift({ ...item, id: Date.now(), at: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = (email, _password) => {
    setUser({
      name: email?.split('@')[0] || 'User',
      email: email || '',
      avatarUrl: null,
      displayName: '',
      phone: '',
      bio: '',
      preferences: { notifications: true, language: 'en', studyYear: '' },
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
