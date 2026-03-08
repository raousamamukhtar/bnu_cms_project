import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const baseLink =
  'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all';

const activeClasses = 'bg-emerald-500 text-white shadow-lg';
const inactiveClasses =
  'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50';

export function Sidebar() {
  const { user } = useAuth();


  const role = user?.role;

  const sections = {
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/data-entry', label: 'Data Entry' },
      { to: '/admin/history', label: 'History' },
    ],
    coordinator: [
      { to: '/coordinator/dashboard', label: 'Dashboard' },
      { to: '/coordinator/data-entry', label: 'Data Entry' },
      { to: '/coordinator/history', label: 'History' },
    ],
    student_affairs: [
      { to: '/student-affairs/dashboard', label: 'Dashboard' },
      { to: '/student-affairs/data-entry', label: 'Data Entry' },
      { to: '/student-affairs/history', label: 'History' },
    ],
    management: [
      { to: '/management/dashboard', label: 'Dashboard' },
      { to: '/management/reports', label: 'Reports & Export' },
      { to: '/management/events', label: 'Live Events Feed' },
    ],
    hr: [
      { to: '/hr/dashboard', label: 'Dashboard' },
      { to: '/hr/data-entry', label: 'Data Entry' },
      { to: '/hr/history', label: 'History' },
    ],
    marketing: [
      { to: '/marketing/dashboard', label: 'Dashboard' },
      { to: '/marketing/data-entry', label: 'Data Entry' },
      { to: '/marketing/history', label: 'History' },
    ],
    carbon_accountant: [
      { to: '/carbon-accountant/dashboard', label: 'Dashboard' },
      { to: '/carbon-accountant/data-entry', label: 'Data Entry' },
      { to: '/carbon-accountant/history', label: 'History' },
    ],
    super_admin: [
      { to: '/admin/dashboard', label: 'Admin Dashboard' },
      { to: '/admin/data-entry', label: 'Admin Data Entry' },
      { to: '/admin/history', label: 'Admin History' },
      { to: '/coordinator/dashboard', label: 'Coordinator Dashboard' },
      { to: '/coordinator/data-entry', label: 'Coordinator Data Entry' },
      { to: '/management/dashboard', label: 'Management Dashboard' },
      { to: '/management/reports', label: 'Management Reports' },
      { to: '/hr/dashboard', label: 'HR Dashboard' },
      { to: '/hr/data-entry', label: 'HR Data Entry' },
      { to: '/marketing/dashboard', label: 'Marketing Dashboard' },
      { to: '/marketing/data-entry', label: 'Marketing Data Entry' },
      { to: '/marketing/history', label: 'Marketing History' },
      { to: '/carbon-accountant/dashboard', label: 'Carbon Accountant Dashboard' },
      { to: '/carbon-accountant/data-entry', label: 'Carbon Accountant Data Entry' },
      { to: '/carbon-accountant/history', label: 'Carbon Accountant History' },
      { to: '/management/events', label: 'Management Events' },
    ],
  };

  const links = sections[role] ?? [];

  return (
    <aside className="hidden md:flex md:flex-col w-64 h-screen sticky top-0 p-4 gap-4 bg-white/70 backdrop-blur border-r border-white/60 shadow-lg overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-semibold shadow-lg">
          SD
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Sustainability DMS
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {role ?? 'Guest'} Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}


