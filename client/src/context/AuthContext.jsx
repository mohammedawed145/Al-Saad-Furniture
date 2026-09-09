import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'alsaad_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setAdmin(null);
      setReady(true);
      return;
    }
    api
      .get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAdmin(res.data.admin))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setAdmin(null);
      })
      .finally(() => setReady(true));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      admin,
      ready,
      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setAdmin(res.data.admin);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setAdmin(null);
      },
    }),
    [token, admin, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
