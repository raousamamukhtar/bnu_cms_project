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
 * Get all marketing submitted entries
 * @returns {Array} Array of entry objects
 */
const getAllMarketingEntries = () => {
  const entries = [];
  const processed = new Set();
  
  // Scan localStorage for all marketing entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('marketing_data_')) {
      // Extract year and month from key format: marketing_data_{year}_{month}
      const keyWithoutPrefix = key.replace('marketing_data_', '');
      
      // Find the month name in the key
      let actualMonth = null;
      let year = null;
      
      // Try to find month name in the key
      for (const monthName of months) {
        if (keyWithoutPrefix.includes(monthName)) {
          actualMonth = monthName;
          // Extract year (should be before the month)
          const yearMatch = keyWithoutPrefix.match(/^(\d{4})_/);
          if (yearMatch) {
            year = yearMatch[1];
          }
          break;
        }
      }
      
      if (actualMonth && year) {
        const entryKey = `${year}_${actualMonth}`;
        
        // Avoid duplicates
        if (!processed.has(entryKey)) {
          processed.add(entryKey);
          
          try {
            const entryData = localStorage.getItem(key);
            if (entryData) {
              const data = JSON.parse(entryData);
              if (data.marketing && Array.isArray(data.marketing)) {
                // Create an entry for each marketing event
                data.marketing.forEach((marketingItem, index) => {
                  entries.push({
                    id: `${year}_${actualMonth}_${index}`,
                    year,
                    month: actualMonth,
                    type: marketingItem.type,
                    eventName: marketingItem.eventName,
                    campaignName: marketingItem.campaignName,
                    link: marketingItem.link,
                    date: marketingItem.date,
                    attachment: marketingItem.attachment,
                    submittedAt: data.submittedAt || null,
                  });
                });
              }
            }
          } catch (e) {
            console.error('Error parsing marketing entry:', e);
          }
        }
      }
    }
  }
  
  // Sort by year (descending) then by month, then by date
  entries.sort((a, b) => {
    if (b.year !== a.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (b.month !== a.month) {
      return months.indexOf(b.month) - months.indexOf(a.month);
    }
    return new Date(b.date || 0) - new Date(a.date || 0);
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

export default function MarketingHistory() {
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    try {
      setLoading(true);
      const allEntries = getAllMarketingEntries();
      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      addToast('Failed to load history entries', 'error');
    } finally {
      setLoading(false);
    }
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

  const formatEventDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getEventName = (entry) => {
    return entry.eventName || entry.campaignName || 'Untitled Event';
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
      header: 'Event Details',
      accessor: 'details',
      cell: (row) => (
        <div className="text-sm text-slate-600 max-w-md">
          <div className="font-medium text-slate-900 mb-1">{getEventName(row)}</div>
          <div className="text-xs text-slate-500">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium mr-2">
              {row.type}
            </span>
            {row.date && (
              <span>Date: {formatEventDate(row.date)}</span>
            )}
          </div>
          {row.link && (
            <a 
              href={row.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 hover:text-emerald-700 underline mt-1 block truncate"
            >
              {row.link}
            </a>
          )}
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
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white">
              <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">Marketing</p>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Marketing Event History</h1>
              <p className="text-sm text-emerald-50">View all submitted marketing events and campaigns</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/marketing/dashboard')}
                className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
              >
                ← Back to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/marketing/data-entry')}
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
                  onClick={() => navigate('/marketing/data-entry')}
                >
                  Create New Entry
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Events ({entries.length})
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

