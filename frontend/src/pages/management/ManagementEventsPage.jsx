import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { getEvents } from '../../services/eventService';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export default function ManagementEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterYear, setFilterYear] = useState('All');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            // Ensure data is an array
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unique departments/roles from events for filter dropdown
    const departments = useMemo(() => {
        if (!events.length) return ['All'];
        const depts = new Set(events.map(event => event.department || 'Unknown'));
        return ['All', ...Array.from(depts)];
    }, [events]);

    // Get unique event types
    const eventTypes = useMemo(() => {
        if (!events.length) return ['All'];
        const types = new Set(events.map(event => event.type));
        return ['All', ...Array.from(types)];
    }, [events]);

    // Get unique months 
    const months = useMemo(() => {
        if (!events.length) return ['All'];
        // Assuming event.month is a number 1-12
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const eventMonths = new Set(events.map(event => monthNames[event.month - 1]));
        return ['All', ...Array.from(eventMonths)];
    }, [events]);

    // Get unique years
    const years = useMemo(() => {
        if (!events.length) return ['All'];
        const eventYears = new Set(events.map(event => event.year.toString()));
        return ['All', ...Array.from(eventYears).sort((a, b) => b - a)];
    }, [events]);


    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch =
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.submittedBy && event.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDepartment = filterDepartment === 'All' || (event.department === filterDepartment);
            const matchesType = filterType === 'All' || event.type === filterType;

            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const eventMonthName = monthNames[event.month - 1];
            const matchesMonth = filterMonth === 'All' || eventMonthName === filterMonth;
            const matchesYear = filterYear === 'All' || event.year.toString() === filterYear;

            return matchesSearch && matchesDepartment && matchesType && matchesMonth && matchesYear;
        });
    }, [events, searchTerm, filterDepartment, filterType, filterMonth, filterYear]);


    const getDepartmentColor = (dept) => {
        const colors = {
            'HR': 'bg-pink-100 text-pink-700 border-pink-200',
            'SCHOOL_COORDINATOR': 'bg-purple-100 text-purple-700 border-purple-200',
            'MARKETING': 'bg-orange-100 text-orange-700 border-orange-200',
            'CARBON_ACCOUNTANT': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'STUDENT_AFFAIRS': 'bg-blue-100 text-blue-700 border-blue-200',
            'SUSTAINABILITY_ADMIN': 'bg-slate-100 text-slate-700 border-slate-200',
        };
        return colors[dept] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Events Overview</h1>
                        <p className="text-slate-500">Monitor and track sustainability events across all departments</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                            Total Events: {events.length}
                        </span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                            Filtered: {filteredEvents.length}
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-4 sm:p-6 shadow-sm border border-slate-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Search</label>
                            <Input
                                placeholder="Search events, descriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                            <Select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                options={departments.map(d => ({ label: d, value: d }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Event Type</label>
                            <Select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                options={eventTypes.map(t => ({ label: t, value: t }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Month</label>
                            <Select
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                options={months.map(m => ({ label: m, value: m }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Year</label>
                            <Select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                options={years.map(y => ({ label: y, value: y }))}
                            />
                        </div>
                    </div>
                </Card>

                {/* Events Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="h-64 animate-pulse bg-slate-100 border-transparent shadow-none" />
                        ))}
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="group relative flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden h-full">

                                {/* Department Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getDepartmentColor(event.department)}`}>
                                        {event.department.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm w-12 h-12">
                                        <span className="text-xs font-bold text-slate-400 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg font-bold text-slate-800 leading-none">{new Date(event.date).getDate()}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 pt-16 flex-grow flex flex-col">
                                    <div className="mb-3">
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-block mb-2">
                                            {event.type}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                            {event.name}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">
                                        {event.description}
                                    </p>

                                    <div className="pt-4 border-t border-slate-100 mt-auto">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                                                    {event.submittedBy.substring(0, 2)}
                                                </span>
                                                <span className="font-medium truncate max-w-[100px]">{event.submittedBy}</span>
                                            </div>
                                            <span className="text-slate-400">{event.year}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachment indicator if exists */}
                                {event.attachment && (
                                    <div className="bg-slate-50 px-5 py-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                        <span>Attachment available</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No events found</h3>
                        <p className="text-slate-500 text-sm max-w-xs text-center">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterDepartment('All'); setFilterType('All'); setFilterMonth('All'); setFilterYear('All'); }}
                            className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
