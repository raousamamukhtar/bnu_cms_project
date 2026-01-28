import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { useUI } from '../../context/UIContext';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Get all carbon accountant submitted entries
 * @returns {Promise<Array>} Array of entry objects
 */
const getAllCarbonAccountantEntries = async () => {
  const entries = [];
  const processed = new Set();
  
  // Scan localStorage for all carbon accountant entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('carbon_accountant_data_')) {
      const parts = key.replace('carbon_accountant_data_', '').split('_');
      if (parts.length === 2) {
        const year = parts[0];
        const month = parts[1];
        const entryKey = `${year}_${month}`;
        
        // Avoid duplicates
        if (!processed.has(entryKey)) {
          processed.add(entryKey);
          
          const entryData = localStorage.getItem(key);
          if (entryData) {
            try {
              const data = JSON.parse(entryData);
              entries.push({
                year,
                month,
                data,
                submittedAt: localStorage.getItem(`carbon_accountant_submittedAt_${year}_${month}`) || null,
              });
            } catch (e) {
              console.error('Error parsing entry data:', e);
            }
          }
        }
      }
    }
  }
  
  // Sort by year (descending) then by month
  entries.sort((a, b) => {
    if (b.year !== a.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    return months.indexOf(b.month) - months.indexOf(a.month);
  });
  
  return entries;
};

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

export default function CarbonAccountantHistory() {
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
      const allEntries = await getAllCarbonAccountantEntries();
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
    navigate(`/carbon-accountant/data-entry?year=${entry.year}&month=${entry.month}&edit=true`);
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
    
    if (data.aqi) {
      preview.push(`AQI: ${data.aqi}`);
    }
    if (data.carbonFootprint) {
      preview.push(`Carbon: ${data.carbonFootprint} tCO₂e`);
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
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">Carbon Accountant</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Data Entry History</h1>
              <p className="text-sm text-emerald-50">View and edit your submitted carbon and AQI data entries</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/carbon-accountant/dashboard')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                ← Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/carbon-accountant/data-entry')}
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
                  onClick={() => navigate('/carbon-accountant/data-entry')}
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

