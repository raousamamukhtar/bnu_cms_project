import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sdms_auth';

// Map role names from backend to frontend routes
const ROLE_REDIRECT = {
  // Database role names (Handle both spaces and underscores for production/local compatibility)
  'Admin': '/admin/dashboard',
  'SUSTAINABILITY_ADMIN': '/admin/dashboard',
  'School Coordinator': '/coordinator/dashboard',
  'SCHOOL_COORDINATOR': '/coordinator/dashboard',
  'HR': '/hr/dashboard',
  'Marketing': '/marketing/dashboard',
  'MARKETING': '/marketing/dashboard',
  'Student Affairs': '/student-affairs/dashboard',
  'STUDENT_AFFAIRS': '/student-affairs/dashboard',
  'Management': '/management/dashboard',
  'MANAGEMENT': '/management/dashboard',
  'Carbon Accountant': '/carbon-accountant/dashboard',
  'CARBON_ACCOUNTANT': '/carbon-accountant/dashboard',

  // Fallback slug mappings
  'admin': '/admin/dashboard',
  'coordinator': '/coordinator/dashboard',
  'hr': '/hr/dashboard',
  'marketing': '/marketing/dashboard',
  'student_affairs': '/student-affairs/dashboard',
  'management': '/management/dashboard',
  'carbon_accountant': '/carbon-accountant/dashboard',
};

// Map role IDs to role slugs (used for local state and AppRoutes)
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

      // Determine redirect path based on role name or ID mapping
      const roleName = data.user.role?.role_name;
      const roleKey = Object.keys(ROLE_REDIRECT).find(
        (key) => key.toLowerCase() === roleName?.toLowerCase()
      );

      const redirectPath = roleKey 
        ? ROLE_REDIRECT[roleKey]
        : (ROLE_REDIRECT[ROLE_ID_TO_NAME[parseInt(data.user.role_id)]] || '/coordinator/dashboard');
      
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

