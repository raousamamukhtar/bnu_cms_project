import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useUI } from '../../context/UIContext';
import { getAllSubmittedEntries } from '../../services/dataEntryService';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Check if an entry can be edited (current month or previous month only)
 * @param {string} year - Year (e.g., "2025")
 * @param {string} month - Month (e.g., "January")
 * @returns {boolean} True if the entry can be edited
 */
const canEditEntry = (year, month) => {
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonthIndex = now.getMonth(); // 0-based (0 = January)
  const currentMonth = months[currentMonthIndex];
  
  // Calculate previous month
  const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const previousMonth = months[previousMonthIndex];
  const previousYear = currentMonthIndex === 0 
    ? (now.getFullYear() - 1).toString() 
    : currentYear;
  
  // Can edit current month or previous month only
  return (
    (year === currentYear && month === currentMonth) ||
    (year === previousYear && month === previousMonth)
  );
};

export default function AdminHistory() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const allEntries = await getAllSubmittedEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      addToast('Failed to load history entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    // Check if entry can be edited
    if (!canEditEntry(entry.year, entry.month)) {
      addToast('Cannot edit entries older than one month', 'error');
      return;
    }
    // Navigate to data entry with the month/year pre-filled
    navigate(`/admin/data-entry?year=${entry.year}&month=${entry.month}&edit=true`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDataPreview = (entry) => {
    const { data } = entry;
    const preview = [];
    
    if (data.step1) {
      preview.push(`${data.step1.students || 0} students, ${data.step1.employees || 0} employees`);
    }
    if (data.step2 && data.step2.paperReams) {
      preview.push(`${data.step2.paperReams} reams paper`);
    }
    if (data.step3 && data.step3.electricityUnits) {
      preview.push(`${data.step3.electricityUnits} kWh`);
    }
    if (data.step4 && data.step4.waterUnits) {
      preview.push(`${data.step4.waterUnits} m³ water`);
    }
    
    return preview.length > 0 ? preview.join(', ') : 'No data';
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
      header: 'Data Preview',
      accessor: 'preview',
      cell: (row) => (
        <div className="text-sm text-slate-600 max-w-md">
          {getDataPreview(row)}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
          ✓ Completed
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => {
        const editable = canEditEntry(row.year, row.month);
        return editable ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleEdit(row)}
            className="text-xs"
          >
            Edit
          </Button>
        ) : (
          <span className="text-xs text-slate-400 italic">Locked</span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">Admin</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry History</h1>
              <p className="text-sm text-emerald-50">View and edit your submitted monthly data entries</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/dashboard')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                ← Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/data-entry')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                + New Entry
              </Button>
            </div>
          </div>
        </div>

        {/* History Table */}
        <Card className="bg-white border-2 border-emerald-100 shadow-lg">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Loading entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg mb-4">No submitted entries found</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/data-entry')}
                >
                  Create New Entry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Entries ({entries.length})
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={loadEntries}
                    className="text-xs"
                  >
                    Refresh
                  </Button>
                </div>
                <Table columns={columns} data={entries} />
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

