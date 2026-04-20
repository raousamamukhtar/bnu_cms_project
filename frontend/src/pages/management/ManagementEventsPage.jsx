import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { getEvents } from '../../services/eventService';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { generateEventsReport } from '../../utils/reportExporter';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function ManagementEventsPage() {
    const [events, setEvents] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [filterSchool, setFilterSchool] = useState('All');
    const [filterMonth, setFilterMonth] = useState('All');
    const [filterYear, setFilterYear] = useState('All');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const [eventsData, dashboardData] = await Promise.all([
                getEvents(),
                import('../../services/reportsService').then(m => m.reportsService.getDashboardData())
            ]);
            setEvents(Array.isArray(eventsData) ? eventsData : []);
            setPeriods(Array.isArray(dashboardData) ? dashboardData : []);
        } catch (error) {
            console.error('Error loading events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Get unique departments/roles from events for filter dropdown
    const departments = useMemo(() => {
        if (!events.length) return [{ label: 'All Departments', value: 'All' }];
        const depts = new Set(events.map(event => event.department || 'Unknown'));
        const options = Array.from(depts).map(d => ({
            label: d.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
            value: d
        }));
        return [{ label: 'All Departments', value: 'All' }, ...options];
    }, [events]);

    // Get unique schools
    const schools = useMemo(() => {
        if (!events.length) return [{ label: 'All Schools', value: 'All' }];
        const schoolList = new Set(events.filter(e => e.school_name).map(event => event.school_name));
        const options = Array.from(schoolList).map(s => ({
            label: s,
            value: s
        }));
        return [{ label: 'All Schools', value: 'All' }, ...options];
    }, [events]);

    // Get unique event types
    const eventTypes = useMemo(() => {
        if (!events.length) return ['All'];
        const types = new Set(events.map(event => event.type));
        return ['All', ...Array.from(types)];
    }, [events]);

    // Get unique years from periods
    const availableYears = useMemo(() => {
        if (!periods.length) return ['All'];
        const y = new Set(periods.map(p => p.period.year.toString()));
        return ['All', ...Array.from(y).sort((a, b) => b - a)];
    }, [periods]);

    // Get unique months for the selected year from periods
    const availableMonths = useMemo(() => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        if (!periods.length) return ['All'];
        
        // Filter periods by selected year first
        const filteredPeriods = filterYear === 'All' 
            ? periods 
            : periods.filter(p => p.period.year.toString() === filterYear);
            
        const m = new Set(filteredPeriods.map(p => p.period.month));
        const monthList = Array.from(m).sort((a, b) => monthNames.indexOf(a) - monthNames.indexOf(b));
        
        return ['All', ...monthList];
    }, [periods, filterYear]);


    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch =
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (event.submittedBy && event.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDepartment = filterDepartment === 'All' || (event.department === filterDepartment);
            const matchesSchool = filterSchool === 'All' || event.school_name === filterSchool;
            const matchesType = filterType === 'All' || event.type === filterType;

            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const eventMonthName = monthNames[event.month - 1];
            const matchesMonth = filterMonth === 'All' || eventMonthName === filterMonth;
            const matchesYear = filterYear === 'All' || event.year.toString() === filterYear;

            return matchesSearch && matchesDepartment && matchesSchool && matchesType && matchesMonth && matchesYear;
        });
    }, [events, searchTerm, filterDepartment, filterSchool, filterType, filterMonth, filterYear]);

    const handleExport = () => {
        if (!filteredEvents.length) return;
        
        let title = 'Sustainability Events Feed';
        if (filterDepartment !== 'All') title += ` - ${filterDepartment.replace('_', ' ')}`;
        if (filterYear !== 'All') title += ` (${filterYear})`;
        
        generateEventsReport(filteredEvents, title);
    };


    const getDepartmentColor = (dept) => {
        if (!dept) return 'bg-gray-100 text-gray-700 border-gray-200';
        const normalizedDept = dept.toUpperCase().replace(/\s+/g, '_');
        
        const colors = {
            'HR': 'bg-pink-100 text-pink-700 border-pink-200',
            'SCHOOL_COORDINATOR': 'bg-purple-100 text-purple-700 border-purple-200',
            'COORDINATOR': 'bg-purple-100 text-purple-700 border-purple-200',
            'MARKETING': 'bg-orange-100 text-orange-700 border-orange-200',
            'CARBON_ACCOUNTANT': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'STUDENT_AFFAIRS': 'bg-blue-100 text-blue-700 border-blue-200',
            'SUSTAINABILITY_ADMIN': 'bg-slate-100 text-slate-700 border-slate-200',
            'ADMIN': 'bg-slate-100 text-slate-700 border-slate-200',
        };
        return colors[normalizedDept] || 'bg-gray-100 text-gray-700 border-gray-200';
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
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                            variant="primary"
                            onClick={handleExport}
                            disabled={!filteredEvents.length}
                            className="group flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-0 shadow-lg hover:shadow-emerald-500/20 px-6 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold tracking-tight">Generate Event Report</span>
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                                Total Events: {events.length}
                            </span>
                            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                                Filtered: {filteredEvents.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-4 sm:p-6 shadow-sm border border-slate-200/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
                                options={departments}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">School</label>
                            <Select
                                value={filterSchool}
                                onChange={(e) => setFilterSchool(e.target.value)}
                                options={schools}
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
                                options={availableMonths.map(m => ({ label: m, value: m }))}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Year</label>
                            <Select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                options={availableYears.map(y => ({ label: y, value: y }))}
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
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                                                    {event.submittedBy.substring(0, 2)}
                                                </span>
                                                <div className="flex flex-col truncate">
                                                    <span className="font-bold truncate text-slate-700">{event.submittedBy}</span>
                                                    {event.school_name && <span className="text-[10px] text-emerald-600 font-bold">{event.school_name}</span>}
                                                </div>
                                            </div>
                                            <span className="text-slate-400 font-medium">{event.year}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Attachment indicator if exists */}
                                {event.link && (
                                    <a 
                                        href={event.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="bg-emerald-50 px-5 py-2.5 border-t border-emerald-100 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        <span>Visit Resource Link</span>
                                    </a>
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
                            onClick={() => { setSearchTerm(''); setFilterDepartment('All'); setFilterSchool('All'); setFilterType('All'); setFilterMonth('All'); setFilterYear('All'); }}
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
