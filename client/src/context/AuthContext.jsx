import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authLogin, authSignup } from '../services/authService';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  const token = localStorage.getItem('careermentor_token');
  const user = localStorage.getItem('careermentor_user');

  return {
    token,
    user: user ? JSON.parse(user) : null
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored.token && stored.user) {
      setToken(stored.token);
      setUser(stored.user);
    }
    setReady(true);
  }, []);

  const syncSession = (payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem('careermentor_token', payload.token);
    localStorage.setItem('careermentor_user', JSON.stringify(payload.user));
  };

  const signup = async (formData) => {
    const payload = await authSignup(formData);
    syncSession(payload);
    return payload;
  };

  const login = async (formData) => {
    const payload = await authLogin(formData);
    syncSession(payload);
    return payload;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('careermentor_token');
    localStorage.removeItem('careermentor_user');
    localStorage.removeItem('careermentor_latest_resume_id');
    localStorage.removeItem('careermentor_latest_roadmap_id');
  };

  const value = useMemo(() => ({ user, token, ready, signup, login, logout }), [user, token, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
