import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ?? <Outlet />;
}

export function RoleRoute({ roles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super admin has access to all routes
  if (user?.role === 'super_admin') {
    return <Outlet />;
  }

  if (!roles.includes(user?.role)) {
    console.warn(`Access denied to role: ${user?.role}. Required one of: ${roles.join(', ')}`);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}


