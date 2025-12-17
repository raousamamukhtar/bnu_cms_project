import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import { ProtectedRoute, RoleRoute } from './ProtectedRoutes';
import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import DataEntry from '../pages/coordinator/DataEntry';
import SubmissionHistory from '../pages/coordinator/SubmissionHistory';
import ManagementDashboard from '../pages/management/ManagementDashboard';
import UniversityKPI from '../pages/management/UniversityKPI';
import DepartmentTrends from '../pages/management/DepartmentTrends';
import DepartmentResources from '../pages/management/DepartmentResources';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDataEntry from '../pages/admin/DataEntry';
import HRDashboard from '../pages/hr/HRDashboard';
import HRDataEntry from '../pages/hr/DataEntry';
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import MarketingDataEntry from '../pages/marketing/DataEntry';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const map = {
    admin: '/admin/dashboard',
    coordinator: '/coordinator/dashboard',
    management: '/management/dashboard',
    hr: '/hr/dashboard',
    marketing: '/marketing/dashboard',
  };
  return <Navigate to={map[user.role] ?? '/login'} replace />;
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<RoleRedirect />} />

          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/data-entry" element={<AdminDataEntry />} />
          </Route>

          <Route element={<RoleRoute roles={['coordinator']} />}>
            <Route path="coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="coordinator/data-entry" element={<DataEntry />} />
            <Route path="coordinator/submissions" element={<SubmissionHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['management']} />}>
            <Route path="management/dashboard" element={<ManagementDashboard />} />
            <Route path="management/university-kpi" element={<UniversityKPI />} />
            <Route path="management/department-trends" element={<DepartmentTrends />} />
            <Route path="management/department-resources" element={<DepartmentResources />} />
          </Route>

          <Route element={<RoleRoute roles={['hr']} />}>
            <Route path="hr/dashboard" element={<HRDashboard />} />
            <Route path="hr/data-entry" element={<HRDataEntry />} />
          </Route>

          <Route element={<RoleRoute roles={['marketing']} />}>
            <Route path="marketing/dashboard" element={<MarketingDashboard />} />
            <Route path="marketing/data-entry" element={<MarketingDataEntry />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


