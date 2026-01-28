import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import { ProtectedRoute, RoleRoute } from './ProtectedRoutes';
import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import DataEntry from '../pages/coordinator/DataEntry';
import SubmissionHistory from '../pages/coordinator/SubmissionHistory';
import CarbonAQIDashboard from '../pages/carbon_accountant/CarbonAQIDashboard';
import CarbonAQIDataEntry from '../pages/carbon_accountant/CarbonAQIDataEntry';
import CarbonAccountantHistory from '../pages/carbon_accountant/CarbonAccountantHistory';
import ManagementDashboard from '../pages/management/ManagementDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDataEntry from '../pages/admin/DataEntry';
import AdminHistory from '../pages/admin/AdminHistory';
import HRDashboard from '../pages/hr/HRDashboard';
import HRDataEntry from '../pages/hr/DataEntry';
import MarketingDashboard from '../pages/marketing/MarketingDashboard';
import MarketingDataEntry from '../pages/marketing/DataEntry';
import MarketingHistory from '../pages/marketing/MarketingHistory';
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
    carbon_accountant: '/carbon-accountant/dashboard',
    super_admin: '/admin/dashboard',
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
            <Route path="admin/history" element={<AdminHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['coordinator']} />}>
            <Route path="coordinator/dashboard" element={<CoordinatorDashboard />} />
            <Route path="coordinator/data-entry" element={<DataEntry />} />
            <Route path="coordinator/submissions" element={<SubmissionHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['carbon_accountant']} />}>
            <Route path="carbon-accountant/dashboard" element={<CarbonAQIDashboard />} />
            <Route path="carbon-accountant/data-entry" element={<CarbonAQIDataEntry />} />
            <Route path="carbon-accountant/history" element={<CarbonAccountantHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['management']} />}>
            <Route path="management/dashboard" element={<ManagementDashboard />} />
          </Route>

          <Route element={<RoleRoute roles={['hr']} />}>
            <Route path="hr/dashboard" element={<HRDashboard />} />
            <Route path="hr/data-entry" element={<HRDataEntry />} />
          </Route>

          <Route element={<RoleRoute roles={['marketing']} />}>
            <Route path="marketing/dashboard" element={<MarketingDashboard />} />
            <Route path="marketing/data-entry" element={<MarketingDataEntry />} />
            <Route path="marketing/history" element={<MarketingHistory />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


