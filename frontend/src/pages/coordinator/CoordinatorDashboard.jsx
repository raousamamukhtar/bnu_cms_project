import { useState, useEffect, useMemo } from 'react';
import { StatCard, Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';

/**
 * Load all coordinator events from localStorage
 * @returns {Array} Array of event entries
 */
const loadCoordinatorEvents = () => {
  const events = [];
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Scan localStorage for all coordinator event entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('coordinator_events_')) {
      const parts = key.replace('coordinator_events_', '').split('_');
      if (parts.length >= 2) {
        const year = parts[0];
        const month = parts[1];
        
        try {
          const entryData = localStorage.getItem(key);
          if (entryData) {
            const data = JSON.parse(entryData);
            if (Array.isArray(data.events)) {
              data.events.forEach((event, index) => {
                if (event.name || event.type || event.date) {
                  events.push({
                    id: `${year}_${month}_${index}`,
                    year,
                    month,
                    ...event,
                    submittedAt: data.submittedAt || new Date().toISOString(),
                  });
                }
              });
            }
          }
        } catch (e) {
          console.error('Error parsing coordinator event:', e);
        }
      }
    }
  }
  
  // Sort by year (descending) then by month, then by date
  events.sort((a, b) => {
    if (b.year !== a.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (b.month !== a.month) {
      return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
    }
    return new Date(b.date || 0) - new Date(a.date || 0);
  });
  
  return events;
};

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const myDept = user?.department;

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        setLoading(true);
        const loadedEvents = loadCoordinatorEvents();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Calculate stats
  const totalEvents = events.length;
  const completedEvents = events.filter((e) => e.status === 'Completed').length;
  const pendingEvents = events.filter((e) => e.status !== 'Completed' && e.status !== 'In Progress').length;
  const inProgressEvents = events.filter((e) => e.status === 'In Progress').length;

  // Get recent events (last 10)
  const recentEvents = useMemo(() => {
    return events.slice(0, 10);
  }, [events]);

  const stats = [
    {
      label: 'Total Events',
      value: totalEvents,
      trend: totalEvents,
      trendLabel: 'all time',
    },
    {
      label: 'Completed Events',
      value: completedEvents,
      trend: completedEvents,
      trendLabel: 'completed',
    },
    {
      label: 'In Progress',
      value: inProgressEvents,
      trend: inProgressEvents,
      trendLabel: 'active',
    },
    {
      label: 'Pending Events',
      value: pendingEvents,
      trend: pendingEvents,
      trendLabel: 'pending',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              Coordinator - {myDept || 'Department'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Coordinator Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              Manage and monitor department events and activities
            </p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => navigate('/coordinator/data-entry')}
            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
          >
            New Data Entry
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Events Table */}
      <Card className="overflow-hidden">
        <div className="p-4 sm:p-5 pb-0">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            Recent Events
          </h3>
          <p className="text-xs text-slate-500 mt-1 break-words">
            Latest events and activities for {myDept || 'department'}
          </p>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading events...</p>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg mb-4">No events recorded yet</p>
              <Button
                variant="primary"
                onClick={() => navigate('/coordinator/data-entry')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add Your First Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Event Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Period</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                        {event.name || 'Untitled Event'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {event.type || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {event.month} {event.year}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      
    </div>
  );
}
