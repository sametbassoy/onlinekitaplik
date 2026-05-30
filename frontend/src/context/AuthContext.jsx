import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data?.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async ({ email, sifre }) => {
    const res = await api.post('/api/auth/login', { email, sifre });
    setUser(res.data?.user || null);
    return res.data;
  }, []);

  const register = useCallback(async ({ kullanici_adi, email, sifre }) => {
    const res = await api.post('/api/auth/register', { kullanici_adi, email, sifre });
    setUser(res.data?.user || null);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: Boolean(user),
      isAdmin: user?.rol === 'admin',
      login,
      register,
      logout,
      refetchMe: fetchMe,
    }),
    [user, loading, login, register, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
