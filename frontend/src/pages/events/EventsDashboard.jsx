import { useState, useEffect, useMemo } from 'react';
import { StatCard, Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { getEvents, getMonthName } from '../../services/eventService';
import { formatDate } from '../../utils/formatters';

/**
 * Departmental Events Dashboard
 * A single component that handles HR, Marketing, Coordinator, and Student Affairs dashboards dynamically
 */
export default function EventsDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const role = user?.role_name || '';
    const myDept = user?.department || 'Department';

    // Role-specific configuration
    const config = useMemo(() => {
        const userRole = user?.role || '';
        const default_config = {
            title: 'Department Dashboard',
            subtitle: 'Manage and monitor your department activities',
            entryButtonText: '+ Add New Data',
            entryPath: `/${userRole}/data-entry`,
            historyPath: `/${userRole}/history`,
        };

        if (role.toLowerCase().includes('hr')) {
            return {
                ...default_config,
                title: 'HR Dashboard',
                subtitle: 'View Monthly Faculty Trainings on Environment',
                entryButtonText: 'New Training Entry',
            };
        }

        if (role.toLowerCase().includes('marketing')) {
            return {
                ...default_config,
                title: 'Marketing Dashboard',
                subtitle: 'Manage environment day events and awareness campaigns',
                entryButtonText: 'New Event Entry',
            };
        }

        if (role.toLowerCase().includes('coordinator')) {
            return {
                ...default_config,
                title: 'Coordinator Dashboard',
                subtitle: 'Manage and monitor department events and activities',
                entryButtonText: '+ Add New Event',
            };
        }

        if (role.toLowerCase().includes('student_affairs')) {
            return {
                ...default_config,
                title: 'Student Affairs Dashboard',
                subtitle: 'Monitor student activities and campus events',
                entryButtonText: 'New Student Event',
            };
        }

        return default_config;
    }, [role]);

    // Load events from API (user-specific)
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const loadedEvents = await getEvents();
                setEvents(loadedEvents || []);
            } catch (error) {
                console.error('Error loading events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    // Calculate real metrics from DB data
    const totalEvents = events.length;

    // Get current date info
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1; // JS months are 0-11

    // Filter by year and month using DB data
    const eventsThisYear = events.filter((e) => parseInt(e.year) === currentYear).length;
    const eventsThisMonth = events.filter((e) => {
        const eventYear = parseInt(e.year);
        const eventMonth = parseInt(e.month);
        return eventYear === currentYear && eventMonth === currentMonthNum;
    }).length;

    // Get latest activity
    const latestEvent = events.length > 0 ? events[0] : null;

    // Get recent events (last 10)
    const recentEvents = useMemo(() => {
        return events.slice(0, 10);
    }, [events]);

    const stats = [
        {
            label: 'Total Entries',
            value: totalEvents,
            trend: totalEvents,
            trendLabel: 'all time',
        },
        {
            label: 'This Month',
            value: eventsThisMonth,
            trend: eventsThisMonth,
            trendLabel: 'entries',
        },
        {
            label: 'This Year',
            value: eventsThisYear,
            trend: eventsThisYear,
            trendLabel: 'recorded',
        },
        {
            label: 'Last Entry',
            value: latestEvent ? formatDate(latestEvent.date) : 'No data',
            trend: latestEvent ? 'Real-time' : 'Waiting',
            trendLabel: 'status',
        },
    ];

    return (
        <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-white">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                            {config.title}
                        </h2>
                        <div className="mb-4">
                            <p className="text-lg font-medium text-white opacity-95">
                                Welcome, {user?.name}
                            </p>
                            <p className="text-xs uppercase tracking-widest text-emerald-100 font-bold">
                                {myDept}
                            </p>
                        </div>
                        <p className="text-sm text-emerald-50 opacity-90">
                            {config.subtitle}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(config.historyPath)}
                            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
                        >
                            History
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate(config.entryPath)}
                            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
                        >
                            {config.entryButtonText}
                        </Button>
                    </div>
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
                        Recent Activity
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 break-words">
                        Latest data entries for {myDept}
                    </p>
                </div>
                <div className="p-4 sm:p-5">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500">Loading entries...</p>
                        </div>
                    ) : recentEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg mb-4">No records found yet</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate(config.entryPath)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                Add Your First Entry
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Activity Name</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Period</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</th>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Link</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {recentEvents.map((event) => (
                                        <tr key={event.id} className="hover:bg-slate-50">
                                            <td className="py-3 px-4 text-sm text-slate-900 font-medium">
                                                {event.name || 'Untitled'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                {event.type || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                {event.date ? formatDate(event.date) : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-600">
                                                {getMonthName(event.month)} {event.year}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-500 italic max-w-xs truncate">
                                                {event.description || 'No description'}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium">
                                                {event.link ? (
                                                    <a 
                                                        href={event.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 flex-nowrap"
                                                    >
                                                        🔗 <span className="underline">View</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">N/A</span>
                                                )}
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
