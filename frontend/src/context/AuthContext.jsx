import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { users as usersSeed } from '../data/data';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sdms_auth';

const ROLE_REDIRECT = {
  admin: '/admin/dashboard',
  coordinator: '/coordinator/dashboard',
  management: '/management/dashboard',
  hr: '/hr/dashboard',
  marketing: '/marketing/dashboard',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (username, role) => {
    const normalizedName = username.trim().toLowerCase();
    const matchedUser = usersSeed.find(
      (u) =>
        u.role === role &&
        u.name.trim().toLowerCase() === normalizedName,
    );

    if (role === 'coordinator') {
      if (!matchedUser || !matchedUser.department) {
        throw new Error(
          'Coordinator not linked to any department. Please contact admin.',
        );
      }
    }

    const fakeToken = `fake-jwt-${Date.now()}`;
    const authUser = {
      username: matchedUser?.name ?? username,
      role,
      token: fakeToken,
      department: matchedUser?.department,
      email: matchedUser?.email,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return ROLE_REDIRECT[role] ?? '/';
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}


