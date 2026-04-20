import { useState, useMemo, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUI } from '../../context/UIContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getYearOptions, getDefaultYear } from '../../utils/formatters';
import { createEvent, getMonthNumber } from '../../services/eventService';

/**
 * Departmental Events Data Entry
 * A single component that handles HR, Marketing, Coordinator, and Student Affairs data entry dynamically
 */
export default function EventsDataEntry() {
    const { addToast } = useUI();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    const role = user?.role_name || '';
    const myDept = user?.department || 'Department';

    // Role-specific configuration
    const config = useMemo(() => {
        const userRole = user?.role || '';
        const default_config = {
            title: 'Data Entry',
            subtitle: 'Add entries and activities for your department',
            dashboardPath: `/${userRole}/dashboard`,
            eventTypes: ['Assessment', 'Data Collection', 'Review', 'Setup', 'Meeting', 'Other'],
            labels: {
                eventName: 'Event Name',
                eventType: 'Event Type',
                description: 'Description',
            }
        };

        if (role.toLowerCase().includes('hr')) {
            return {
                ...default_config,
                title: 'HR Training Entry',
                subtitle: 'Record faculty training sessions on environment',
                eventTypes: ['Training', 'Workshop', 'Seminar', 'Orientation'],
                labels: {
                    eventName: 'Training Topic',
                    eventType: 'Training Type',
                    description: 'Participants & Details',
                }
            };
        }

        if (role.toLowerCase().includes('marketing')) {
            return {
                ...default_config,
                title: 'Marketing Event Entry',
                subtitle: 'Record environment day events and awareness campaigns',
                eventTypes: ['Environment Day Event', 'Awareness Campaign', 'Social Media Drive', 'On-ground Activity'],
            };
        }

        if (role.toLowerCase().includes('coordinator')) {
            return {
                ...default_config,
                title: 'Departmental Event Entry',
                subtitle: 'Add events and activities for your department',
                eventTypes: ['Assessment', 'Data Collection', 'Review', 'Setup', 'Training', 'Meeting', 'Other'],
            };
        }

        if (role.toLowerCase().includes('student_affairs')) {
            return {
                ...default_config,
                title: 'Student Affairs Event Entry',
                subtitle: 'Record student activities and campus events',
                eventTypes: ['Student Hackathon', 'Campus Tour', 'Orientation', 'Club Activity', 'Other'],
            };
        }

        return default_config;
    }, [role]);

    const [formData, setFormData] = useState({
        month: '',
        year: getDefaultYear(),
    });

    const [events, setEvents] = useState([
        { name: '', type: '', date: '', description: '', link: '' },
    ]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    // Effect to clear dates if they fall outside the selected period
    useEffect(() => {
        if (formData.year && formData.month) {
            const monthIdx = months.indexOf(formData.month);
            if (monthIdx === -1) return;
            
            const min = `${formData.year}-${String(monthIdx + 1).padStart(2, '0')}-01`;
            const lastDay = new Date(formData.year, monthIdx + 1, 0).getDate();
            const max = `${formData.year}-${String(monthIdx + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
            
            setEvents(prev => prev.map(event => {
                if (event.date && (event.date < min || event.date > max)) {
                    return { ...event, date: '' };
                }
                return event;
            }));
        }
    }, [formData.month, formData.year]);

    const handleEventChange = (index, field, value) => {
        const updatedEvents = [...events];
        updatedEvents[index][field] = value;
        setEvents(updatedEvents);
    };



    const cleanUrl = (url) => {
        if (!url || url.trim() === '') return null;
        const trimmed = url.trim();
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            return `https://${trimmed}`;
        }
        return trimmed;
    };

    const handleAddEvent = () => {
        setEvents([...events, { name: '', type: '', date: '', description: '', link: '' }]);
    };

    const handleRemoveEvent = (index) => {
        if (events.length > 1) {
            const updatedEvents = events.filter((_, i) => i !== index);
            setEvents(updatedEvents);
        } else {
            // Reset the single record to initial state
            setEvents([{ name: '', type: '', date: '', description: '', link: '' }]);
            addToast('Record cleared', 'info');
        }
    };

    const handleSubmitEvents = async (e) => {
        e.preventDefault();

        if (!formData.month || !formData.year) {
            addToast('Please select month and year first', 'error');
            return;
        }

        const validEvents = events.filter(
            (event) => event.name && event.type && event.date && event.description
        );

        if (validEvents.length === 0) {
            addToast('Please fill in all required fields (Name, Type, Date, Description) for at least one record', 'error');
            return;
        }

        if (validEvents.length !== events.length && events.some(e => e.name || e.type || e.date || e.description)) {
            // If some records were partially filled but filtered out
            addToast('Some records were skipped because they were incomplete', 'warning');
        }

        try {
            setSubmitting(true);
            const monthNumber = getMonthNumber(formData.month);
            const savePromises = validEvents.map(event =>
                createEvent({
                    event_month: monthNumber,
                    event_year: parseInt(formData.year),
                    event_name: event.name,
                    event_type: event.type,
                    event_date: event.date,
                    description: event.description,
                    event_link: cleanUrl(event.link),
                    school_id: user.role === 'coordinator' ? user.school_id : null,
                })
            );

            await Promise.all(savePromises);
            addToast(`Successfully saved ${validEvents.length} record(s)!`, 'success');

            setEvents([{ name: '', type: '', date: '', description: '', link: '' }]);
            setFormData({
                month: '',
                year: getDefaultYear(),
            });

            setTimeout(() => {
                navigate(config.dashboardPath);
            }, 1500);
        } catch (error) {
            console.error('Error saving records:', error);
            addToast('Failed to save data. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-white">
                            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
                                {myDept}
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{config.title}</h1>
                            <p className="text-sm text-emerald-50">{config.subtitle}</p>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => navigate(config.dashboardPath)}
                            className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>

                <Card className="bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmitEvents}>
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5">
                            <h3 className="text-lg font-bold text-white">Monthly Records</h3>
                            <p className="text-sm text-emerald-100 mt-0.5">Please provide details for the selected period</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Period</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Month <span className="text-red-500">*</span></label>
                                        <Select
                                            value={formData.month}
                                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                            options={[{ label: 'Select Month', value: '' }, ...months.map(m => ({ label: m, value: m }))]}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Year <span className="text-red-500">*</span></label>
                                        <Select
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            options={getYearOptions()}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {events.map((event, index) => (
                                <div key={index} className="border border-slate-200 rounded-lg p-5 bg-white relative">
                                    <div className="absolute top-4 right-4 print:hidden">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEvent(index)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors py-1 px-2 rounded-md hover:bg-red-50"
                                            title="Delete this record"
                                        >
                                            <span className="text-base">✕</span>
                                            Delete Record
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-4">Record #{index + 1}</h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">{config.labels.eventName} <span className="text-red-500">*</span></label>
                                                <Input
                                                    type="text"
                                                    value={event.name}
                                                    onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                                                    placeholder="Name of the activity/topic"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">{config.labels.eventType} <span className="text-red-500">*</span></label>
                                                <Select
                                                    value={event.type}
                                                    onChange={(e) => handleEventChange(index, 'type', e.target.value)}
                                                    options={[{ label: 'Select Type', value: '' }, ...config.eventTypes.map(t => ({ label: t, value: t }))]}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Date <span className="text-red-500">*</span></label>
                                                <Input
                                                    type="date"
                                                    value={event.date}
                                                    onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                                                    required
                                                    min={formData.year && formData.month ? `${formData.year}-${String(months.indexOf(formData.month) + 1).padStart(2, '0')}-01` : (formData.year ? `${formData.year}-01-01` : undefined)}
                                                    max={formData.year && formData.month ? `${formData.year}-${String(months.indexOf(formData.month) + 1).padStart(2, '0')}-${new Date(formData.year, months.indexOf(formData.month) + 1, 0).getDate()}` : (formData.year ? `${formData.year}-12-31` : undefined)}
                                                    disabled={!formData.year}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-900 mb-2">{config.labels.description} <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={event.description}
                                                onChange={(e) => handleEventChange(index, 'description', e.target.value)}
                                                placeholder="Details about this record"
                                                rows={3}
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-900 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Event Link (Optional)</label>
                                            <Input
                                                type="url"
                                                value={event.link}
                                                onChange={(e) => handleEventChange(index, 'link', e.target.value)}
                                                placeholder="https://example.com/event-details"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                                <Button
                                    type="button"
                                    onClick={handleAddEvent}
                                    variant="secondary"
                                    className="flex-1 border-dashed border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                >
                                    + Add Another Record
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 shadow-sm"
                                >
                                    {submitting ? 'Saving...' : 'Submit Records'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
