import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sdms_auth';

// Map role names from backend to frontend routes
const ROLE_REDIRECT = {
  'SUSTAINABILITY_ADMIN': '/admin/dashboard',
  'SCHOOL_COORDINATOR': '/coordinator/dashboard',
  'HR': '/hr/dashboard',
  'MARKETING': '/marketing/dashboard',
  'STUDENT_AFFAIRS': '/student-affairs/dashboard',
  'MANAGEMENT': '/management/dashboard',
  'CARBON_ACCOUNTANT': '/carbon-accountant/dashboard',
};

// Map role IDs to role names for compatibility
const ROLE_ID_TO_NAME = {
  1: 'admin',
  2: 'coordinator',
  3: 'hr',
  4: 'student_affairs',
  5: 'marketing',
  6: 'carbon_accountant',
  21: 'management',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const userData = JSON.parse(raw);
        setUser(userData);
        // Set auth token for API requests
        if (userData.token) {
          setAuthToken(userData.token);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      // Call backend login API via service
      const data = await authService.login(email, password);

      // Extract user data from response
      const authUser = {
        user_id: data.user.user_id,
        email: data.user.email,
        name: data.user.full_name,
        role: ROLE_ID_TO_NAME[parseInt(data.user.role_id)] || 'coordinator',
        role_name: data.user.role?.role_name,
        department: data.user.school?.school_name || null,
        school_id: data.user.school_id || null,
        token: data.token,
      };

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);

      // Set auth token for API requests
      setAuthToken(authUser.token);

      // Determine redirect path based on role name from backend
      const redirectPath = ROLE_REDIRECT[data.user.role?.role_name] || '/coordinator/dashboard';
      return redirectPath;
    } catch (error) {
      throw new Error(error.message || 'Failed to authenticate. Please try again.');
    }
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

