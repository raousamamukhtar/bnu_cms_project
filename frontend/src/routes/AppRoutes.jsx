import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import { ProtectedRoute, RoleRoute } from './ProtectedRoutes';
import CarbonAQIDashboard from '../pages/carbon_accountant/CarbonAQIDashboard';
import CarbonAQIDataEntry from '../pages/carbon_accountant/CarbonAQIDataEntry';
import CarbonAccountantHistory from '../pages/carbon_accountant/CarbonAccountantHistory';
import ManagementReportsPage from '../pages/management/ManagementReportsPage';
import ManagementEventsPage from '../pages/management/ManagementEventsPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDataEntry from '../pages/admin/DataEntry';
import AdminHistory from '../pages/admin/AdminHistory';
import EventsDashboard from '../pages/events/EventsDashboard';
import EventsDataEntry from '../pages/events/EventsDataEntry';
import EventsHistory from '../pages/events/EventsHistory';
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
    student_affairs: '/student-affairs/dashboard',
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
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/data-entry" element={<AdminDataEntry />} />
            <Route path="/admin/history" element={<AdminHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['coordinator']} />}>
            <Route path="/coordinator/dashboard" element={<EventsDashboard />} />
            <Route path="/coordinator/data-entry" element={<EventsDataEntry />} />
            <Route path="/coordinator/history" element={<EventsHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['hr']} />}>
            <Route path="/hr/dashboard" element={<EventsDashboard />} />
            <Route path="/hr/data-entry" element={<EventsDataEntry />} />
            <Route path="/hr/history" element={<EventsHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['marketing']} />}>
            <Route path="/marketing/dashboard" element={<EventsDashboard />} />
            <Route path="/marketing/data-entry" element={<EventsDataEntry />} />
            <Route path="/marketing/history" element={<EventsHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['carbon_accountant']} />}>
            <Route path="/carbon-accountant/dashboard" element={<CarbonAQIDashboard />} />
            <Route path="/carbon-accountant/data-entry" element={<CarbonAQIDataEntry />} />
            <Route path="/carbon-accountant/history" element={<CarbonAccountantHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['student_affairs']} />}>
            <Route path="/student-affairs/dashboard" element={<EventsDashboard />} />
            <Route path="/student-affairs/data-entry" element={<EventsDataEntry />} />
            <Route path="/student-affairs/history" element={<EventsHistory />} />
          </Route>

          <Route element={<RoleRoute roles={['management']} />}>
            <Route path="/management/dashboard" element={<Navigate to="/management/reports" replace />} />
            <Route path="/management/reports" element={<ManagementReportsPage />} />
            <Route path="/management/events" element={<ManagementEventsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
