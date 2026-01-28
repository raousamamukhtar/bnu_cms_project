import { useState, useEffect, useMemo } from 'react';
import { Card, StatCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

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

export default function MarketingDashboard() {
  const navigate = useNavigate();
  const [marketingData, setMarketingData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        const data = getAllMarketingEntries();
        setMarketingData(data);
      } catch (error) {
        console.error('Error loading marketing data:', error);
        setMarketingData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get recent events (last 10)
  const recentEvents = useMemo(() => {
    return marketingData.slice(0, 10);
  }, [marketingData]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalEvents = marketingData.length;
    const environmentDayEvents = marketingData.filter((m) => m.type === 'Environment Day Event').length;
    const awarenessCampaigns = marketingData.filter((m) => m.type === 'Awareness Campaign').length;

    return [
      {
        label: 'Total Marketing Events',
        value: totalEvents,
        trend: totalEvents,
        trendLabel: 'all time',
      },
      {
        label: 'Environment Day Events',
        value: environmentDayEvents,
        trend: environmentDayEvents,
        trendLabel: 'total',
      },
      {
        label: 'Awareness Campaigns',
        value: awarenessCampaigns,
        trend: awarenessCampaigns,
        trendLabel: 'total',
      },
    ];
  }, [marketingData]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              Marketing Head
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Marketing Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              Manage environment day events and awareness campaigns
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={() => navigate('/marketing/history')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              History
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/marketing/data-entry')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              New Marketing Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 w-full">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Marketing Events */}
      <Card className="overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 p-3 sm:p-4 md:p-5 pb-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-slate-900">
              Recent Marketing Events
            </h3>
            <p className="text-[10px] xs:text-xs text-slate-500 mt-1 break-words">
              Latest environment day events and awareness campaigns
            </p>
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-5 pt-0">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading events...</p>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg mb-4">No marketing events recorded yet</p>
              <Button
                variant="primary"
                onClick={() => navigate('/marketing/data-entry')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Add Your First Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 font-medium">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.month} {item.year}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        {item.eventName || item.campaignName || 'Untitled Event'}
                      </h4>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-700 underline"
                        >
                          {item.link}
                        </a>
                      )}
                    </div>
                    {item.date && (
                      <div className="text-xs text-slate-500">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

