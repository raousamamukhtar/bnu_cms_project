import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { getYearOptions, getDefaultYear, formatDate } from '../../utils/formatters';
import { getEvents, updateEvent, getMonthName } from '../../services/eventService';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Departmental Events History
 * A single component that handles HR, Marketing, Student Affairs, and Coordinator event history
 */
export default function EventsHistory() {
    const { addToast } = useUI();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(getDefaultYear());

    const [modalOpen, setModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);

    const role = user?.role_name || '';
    const myDept = user?.department || 'Department';

    // Role-specific configuration
    const config = useMemo(() => {
        const userRole = user?.role || '';
        const default_config = {
            title: 'History',
            subtitle: 'View and edit your submitted records',
            dashboardPath: `/${userRole}/dashboard`,
            entryPath: `/${userRole}/data-entry`,
            eventTypes: ['Assessment', 'Data Collection', 'Review', 'Setup', 'Meeting', 'Other'],
            labels: {
                eventName: 'Event Name',
                eventType: 'Event Type',
            }
        };

        if (role.toLowerCase().includes('hr')) {
            return {
                ...default_config,
                title: 'HR Training History',
                subtitle: 'View and edit faculty training records',
                eventTypes: ['Training', 'Workshop', 'Seminar', 'Orientation'],
                labels: {
                    eventName: 'Training Topic',
                    eventType: 'Training Type',
                }
            };
        }

        if (role.toLowerCase().includes('marketing')) {
            return {
                ...default_config,
                title: 'Marketing Event History',
                subtitle: 'View and edit marketing campaigns and events',
                eventTypes: ['Environment Day Event', 'Awareness Campaign', 'Social Media Drive', 'On-ground Activity'],
            };
        }

        if (role.toLowerCase().includes('coordinator')) {
            return {
                ...default_config,
                title: 'Departmental Event History',
                subtitle: 'View and edit your department events',
            };
        }

        if (role.toLowerCase().includes('student_affairs')) {
            return {
                ...default_config,
                title: 'Student Affairs Event History',
                subtitle: 'View and edit student activities and events',
                eventTypes: ['Student Hackathon', 'Campus Tour', 'Orientation', 'Club Activity', 'Other'],
            };
        }

        return default_config;
    }, [role]);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            setLoading(true);
            const events = await getEvents();

            const transformedEntries = events.map(event => ({
                id: event.id,
                year: event.year.toString(),
                month: getMonthName(event.month),
                submittedAt: event.submittedAt,
                name: event.name,
                type: event.type,
                date: event.date,
                description: event.description,
                attachmentName: event.attachment,
            }));

            setEntries(transformedEntries);
        } catch (error) {
            console.error('Error loading entries:', error);
            addToast('Failed to load history entries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredEntries = useMemo(() => {
        const filtered = entries.filter((entry) => entry.year == selectedYear);
        return filtered.sort((a, b) => {
            return months.indexOf(b.month) - months.indexOf(a.month);
        });
    }, [entries, selectedYear]);

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setEditFormData({
            name: entry.name || '',
            type: entry.type || '',
            date: entry.date || '',
            description: entry.description || '',
        });
        setModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            setUpdateLoading(true);
            if (!editingEntry) return;

            await updateEvent(editingEntry.id, {
                event_name: editFormData.name,
                event_type: editFormData.type,
                event_date: editFormData.date,
                description: editFormData.description,
            });

            addToast(`Record updated successfully!`, 'success');
            setModalOpen(false);
            await loadEntries();
        } catch (error) {
            console.error('Update failed:', error);
            addToast('Failed to update record', 'error');
        } finally {
            setUpdateLoading(false);
        }
    };

    const columns = [
        {
            header: 'Period',
            accessor: 'period',
            cell: (row) => (
                <div>
                    <div className="font-semibold text-slate-900">{row.month} {row.year}</div>
                    <div className="text-xs text-slate-500">Submitted: {formatDate(row.submittedAt)}</div>
                </div>
            ),
        },
        {
            header: 'Details',
            accessor: 'details',
            cell: (row) => (
                <div>
                    <div className="font-medium text-slate-900">{row.name}</div>
                    <div className="text-xs text-slate-500">{row.type} • {row.date ? formatDate(row.date) : 'N/A'}</div>
                </div>
            ),
        },
        {
            header: 'Description',
            accessor: 'description',
            cell: (row) => (
                <div className="text-sm text-slate-600 max-w-xs truncate" title={row.description}>
                    {row.description}
                </div>
            ),
        },
        {
            header: 'Actions',
            accessor: 'actions',
            cell: (row) => (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(row)}
                    className="text-xs"
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-white">
                            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">{myDept}</p>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{config.title}</h1>
                            <p className="text-sm text-emerald-50">{config.subtitle}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(config.dashboardPath)}
                                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
                            >
                                ← Back to Dashboard
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(config.entryPath)}
                                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
                            >
                                Log New Entry
                            </Button>
                        </div>
                    </div>
                </div>

                <Card className="bg-white border-2 border-emerald-100 shadow-lg">
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500">Loading history...</p>
                            </div>
                        ) : entries.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg mb-4">No records found for {selectedYear}</p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(config.entryPath)}
                                >
                                    Log New Entry
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            Records ({filteredEntries.length})
                                        </h2>
                                        <div className="w-40">
                                            <Select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                options={getYearOptions()}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={loadEntries}
                                        className="text-xs"
                                    >
                                        Refresh
                                    </Button>
                                </div>
                                <Table columns={columns} data={filteredEntries} />
                            </>
                        )}
                    </div>
                </Card>
            </div>

            <Modal
                open={modalOpen}
                onClose={() => !updateLoading && setModalOpen(false)}
                title={`Edit Record - ${editingEntry?.month} ${editingEntry?.year}`}
            >
                <div className="space-y-4 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{config.labels.eventName} <span className="text-red-500">*</span></label>
                            <Input
                                value={editFormData.name}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">{config.labels.eventType} <span className="text-red-500">*</span></label>
                            <Select
                                value={editFormData.type}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
                                options={[
                                    { label: 'Select Type', value: '' },
                                    ...config.eventTypes.map((type) => ({ label: type, value: type })),
                                ]}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date <span className="text-red-500">*</span></label>
                        <Input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Description <span className="text-red-500">*</span></label>
                        <textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-900 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <Button
                        variant="secondary"
                        onClick={() => setModalOpen(false)}
                        disabled={updateLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        loading={updateLoading}
                        disabled={updateLoading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
