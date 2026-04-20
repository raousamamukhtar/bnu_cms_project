import { useState, useMemo, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { getDefaultYear } from '../../utils/formatters';
import { useYearlyDataAggregation } from '../../hooks/useYearlyDataAggregation';
import { useAvailableYears } from '../../hooks/useAvailableYears';
import { transformMonthlyDataForChart } from '../../utils/dataTransformers';
import { DataViewHeader } from '../../components/management/DataViewHeader';
import { DetailedMetricsGrid } from '../../components/management/DetailedMetricsGrid';
import { WasteSegregationSection } from '../../components/management/WasteSegregationSection';
import { YearlyChartsSection } from '../../components/management/YearlyChartsSection';
import { reportsService } from '../../services/reportsService';
import { getEvents } from '../../services/eventService';

const VIEW_TYPES = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

/**
 * Management Dashboard Component
 * Main dashboard for management role displaying environmental data analysis
 */
export default function ManagementDashboard() {
  const [viewType, setViewType] = useState(VIEW_TYPES.MONTHLY);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(getDefaultYear());
  const [monthlyAdminData, setMonthlyAdminData] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await reportsService.getDashboardData();
        setMonthlyAdminData(data);

        // Set default selection to the latest month/year if not already set
        if (data && data.length > 0) {
          // Sort by year, then month to find latest
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const sorted = [...data].sort((a, b) => {
            if (a.period.year !== b.period.year) return b.period.year - a.period.year;
            return months.indexOf(b.period.month) - months.indexOf(a.period.month);
          });

          const latest = sorted[0];
          setSelectedMonth(latest.period.month);
          setSelectedYear(latest.period.year.toString());
        }

        // Load recent events
        const eventsData = await getEvents();
        setRecentEvents(Array.isArray(eventsData) ? eventsData.slice(0, 3) : []);
      } catch (error) {
        console.error('Error loading management data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableYears = useAvailableYears(monthlyAdminData);
  const yearlyData = useYearlyDataAggregation(monthlyAdminData, selectedYear);

  // Filter data by selected year for monthly view (Carbon data already merged from API)
  const filteredYearlyData = useMemo(() => {
    return monthlyAdminData.filter((entry) => entry.period.year == selectedYear);
  }, [monthlyAdminData, selectedYear]);

  // Get month options for selector
  const monthOptions = useMemo(() => {
    return [
      { label: 'Select Month', value: '' },
      ...filteredYearlyData.map((entry) => ({
        label: entry.period.month,
        value: entry.period.month,
      })),
    ];
  }, [filteredYearlyData]);

  // Get year options for selector
  const yearOptions = useMemo(() => {
    return [
      { label: 'Select Year', value: '' },
      ...availableYears.map((year) => ({
        label: year,
        value: year,
      })),
    ];
  }, [availableYears]);

  // Get selected data based on view type
  const selectedData = useMemo(() => {
    if (viewType === VIEW_TYPES.YEARLY) {
      return yearlyData; // Carbon data already aggregated in yearlyData from API
    }

    // Monthly View - carbon data already included from API
    return monthlyAdminData.find(
      (entry) =>
        entry.period.month === selectedMonth &&
        entry.period.year == selectedYear
    ) || null;

  }, [monthlyAdminData, selectedMonth, selectedYear, viewType, yearlyData]);

  // Prepare yearly chart data (always 12 latest months)
  const yearlyChartData = useMemo(() => {
    return transformMonthlyDataForChart(monthlyAdminData);
  }, [monthlyAdminData]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <DataViewHeader
          viewType={viewType}
          onViewTypeChange={setViewType}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          monthOptions={monthOptions}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          yearOptions={yearOptions}
          showMonthSelector={viewType === VIEW_TYPES.MONTHLY}
          showYearSelector={viewType === VIEW_TYPES.YEARLY}
        />

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg animate-pulse">Loading dashboard data...</p>
            </div>
          </Card>
        ) : selectedData ? (
          <>
            <Card>
              <DetailedMetricsGrid data={selectedData} viewType={viewType} />
            </Card>

            {viewType === VIEW_TYPES.YEARLY && (
              <>
                <WasteSegregationSection
                  year={selectedData.period.year}
                  wasteData={selectedData.waste}
                />
                <YearlyChartsSection
                  year={selectedData.period.year}
                  chartData={yearlyChartData}
                />
              </>
            )}

            {/* Recent Events Quick View */}
            {!loading && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-bold text-slate-900">Recent Campus Events</h3>
                   <Button 
                    variant="secondary" 
                    onClick={() => navigate('/management/events')} 
                    className="text-xs font-semibold py-1.5"
                   >
                     View All Events Feed →
                   </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentEvents.length > 0 ? (
                    recentEvents.map(event => (
                      <div key={event.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                             {event.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{event.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{event.description}</p>
                        {event.link && (
                          <a 
                            href={event.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            🔗 Visit Resource Link
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-sm text-slate-400 italic">No recent events recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                No data available for the selected{' '}
                {viewType === VIEW_TYPES.YEARLY ? 'year' : 'month'}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
