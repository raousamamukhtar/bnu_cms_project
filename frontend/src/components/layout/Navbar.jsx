import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pingServer } from '../../utils/api';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    pingServer().then((result) => setApiStatus(result.status ?? 'online'));
  }, []);

  const statusColor =
    apiStatus === 'online'
      ? 'bg-emerald-500'
      : apiStatus === 'offline'
        ? 'bg-red-500'
        : 'bg-amber-500';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between border-b border-white/60 bg-white/60 backdrop-blur">
      <div>
        <h1 className="text-sm lg:text-base font-semibold text-slate-900">
          Sustainability Data Management System
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Track and visualize campus sustainability performance</span>
          <span className="flex items-center gap-1">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            API {apiStatus}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-slate-800">
            {user?.username ?? 'Guest User'}
          </span>
          <span className="text-xs text-slate-500 capitalize">
            {user?.role ?? 'No role'}
          </span>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
          {user?.username?.[0]?.toUpperCase() ?? 'G'}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}


