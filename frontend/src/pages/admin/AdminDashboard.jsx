import { useState, useMemo, useEffect } from 'react';
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, StatCard } from '../../components/ui/Card';
import { ChartWrapper } from '../../components/charts/ChartWrapper';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { formatNumber, getYearOptions, getDefaultYear } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { getAllSubmittedEntries } from '../../services/dataEntryService';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(getDefaultYear());
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load submitted entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const entries = await getAllSubmittedEntries();

      // Transform entries from history format to dashboard format
      const transformedEntries = entries.map((entry, index) => {
        const data = entry.data || {};
        const step1 = data.step1 || {};
        const step2 = data.step2 || {};
        const step3 = data.step3 || {};
        const step4 = data.step4 || {};
        const step5 = data.step5 || {};
        const step6 = data.step6 || {};


        return {
          id: `entry-${entry.year}-${entry.month}`,
          userId: 'admin',
          userName: 'Admin',
          userRole: 'admin',
          month: entry.month,
          year: entry.year,
          students: parseInt(step1.students) || 0,
          employees: parseInt(step1.employees) || 0,
          paperReams: parseFloat(step2.paperReams) || 0,
          paperSheetsPerReam: parseFloat(step2.paperSheetsPerReam) || 500,
          electricityUnits: parseFloat(step3.electricityUnits) || 0,
          electricityTotalCost: parseFloat(step3.electricityTotalCost) || 0,
          waterUnits: parseFloat(step4.waterUnits) || 0,
          waterPricePerUnit: parseFloat(step4.waterPricePerUnit) || 0,
          wasteOrganic: parseFloat(step5.wasteOrganic) || 0,
          wasteRecyclables: parseFloat(step5.wasteRecyclables) || 0,
          wasteOthers: parseFloat(step5.wasteOthers) || 0,
          generatorAvgHours: parseFloat(step6.generatorAvgHours) || 0,
          generatorFuelLitres: parseFloat(step6.generatorFuelLitres) || 0,

          status: 'submitted',
        };
      });

      setMonthlyEntries(transformedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      setMonthlyEntries([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset scroll position on component mount
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Filter entries by year and sort by month (newest first)
  const filteredEntries = useMemo(() => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let filtered = monthlyEntries.filter((entry) => entry.year === selectedYear);

    // Sort by month order (newest first)
    filtered.sort((a, b) => {
      return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
    });

    return filtered;
  }, [monthlyEntries, selectedYear]);

  // Calculate stats from monthly entries
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return [];

    const currentEntry = filteredEntries[0];
    const prevEntry = filteredEntries[1]; // Since it's sorted desc
    const totalEntries = filteredEntries.length;

    const totalWasteCurrent = (currentEntry.wasteOrganic || 0) + (currentEntry.wasteRecyclables || 0) + (currentEntry.wasteOthers || 0);
    const totalWastePrev = prevEntry ? (prevEntry.wasteOrganic || 0) + (prevEntry.wasteRecyclables || 0) + (prevEntry.wasteOthers || 0) : 0;

    const calculateTrend = (current, prev) => {
      if (!prev || prev === 0) return 0;
      return parseFloat(((current - prev) / prev * 100).toFixed(1));
    };

    const electricityTrend = calculateTrend(currentEntry.electricityUnits, prevEntry?.electricityUnits);
    const waterTrend = calculateTrend(currentEntry.waterUnits, prevEntry?.waterUnits);
    const wasteTrend = calculateTrend(totalWasteCurrent, totalWastePrev);

    return [
      {
        label: 'Total Monthly Entries',
        value: totalEntries,
        trend: null, // No trend for total count
        trendLabel: 'this year',
      },
      {
        label: `Electricity (${currentEntry.month})`,
        value: formatNumber(currentEntry.electricityUnits || 0) + ' kWh',
        trend: electricityTrend,
        trendLabel: prevEntry ? `vs ${prevEntry.month}` : 'first entry',
      },
      {
        label: `Water (${currentEntry.month})`,
        value: formatNumber(currentEntry.waterUnits || 0) + ' m³',
        trend: waterTrend,
        trendLabel: prevEntry ? `vs ${prevEntry.month}` : 'first entry',
      },
      {
        label: `Waste (${currentEntry.month})`,
        value: formatNumber(totalWasteCurrent) + ' kg',
        trend: wasteTrend,
        trendLabel: prevEntry ? `vs ${prevEntry.month}` : 'first entry',
      },
    ];
  }, [filteredEntries]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return filteredEntries
      .slice()
      .reverse()
      .map((entry) => ({
        month: entry.month,
        user: entry.userName,
        electricity: entry.electricityUnits || 0,
        water: entry.waterUnits || 0,
        waste: (entry.wasteOrganic || 0) + (entry.wasteRecyclables || 0) + (entry.wasteOthers || 0),
        fuel: entry.generatorFuelLitres || 0,
      }));
  }, [filteredEntries]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 md:gap-6">
        <div className="flex-1 min-w-0 pr-0 sm:pr-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-[0.25em] text-emerald-500 mb-1.5 sm:mb-2 font-medium">
            Admin
          </p>
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold sm:font-semibold text-slate-900 break-words leading-tight sm:leading-snug mb-1.5 sm:mb-2">
            Monthly Environmental Data Dashboard
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 sm:text-slate-600 mt-1 break-words leading-relaxed">
            View and analyze all submitted monthly environmental data entries
          </p>
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <Button
            onClick={() => navigate('/admin/data-entry')}
            className="w-full sm:w-auto text-xs sm:text-sm md:text-base py-2.5 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 font-medium whitespace-nowrap"
          >
            New Monthly Entry
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4 md:p-5 lg:p-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 sm:gap-4 md:gap-5">
          <Select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={getYearOptions()}
          />
        </div>
      </Card>

      {loading && (
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-slate-500">Loading data...</p>
          </div>
        </Card>
      )}

      {!loading && filteredEntries.length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-slate-500 text-lg mb-4">No data entries found for {selectedYear}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/data-entry')}
            >
              Create New Entry
            </Button>
          </div>
        </Card>
      )}

      {!loading && filteredEntries.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
            <ChartWrapper
              title="Monthly Environmental Data Trends"
              description="Electricity, Water, Waste, and Fuel consumption over time"
            >
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 9 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 9 }} width={40} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', padding: '8px' }}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                    iconSize={10}
                  />
                  <Line
                    type="monotone"
                    dataKey="electricity"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    name="Electricity (kWh)"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="water"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Water (m³)"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="waste"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Waste (kg)"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fuel"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Fuel (L)"
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <ChartWrapper
              title="Current Month Comparison"
              description="Latest month data breakdown"
            >
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart
                  data={[
                    {
                      name: 'Electricity',
                      value: filteredEntries[0]?.electricityUnits || 0,
                    },
                    { name: 'Water', value: filteredEntries[0]?.waterUnits || 0 },
                    {
                      name: 'Waste',
                      value:
                        (filteredEntries[0]?.wasteOrganic || 0) +
                        (filteredEntries[0]?.wasteRecyclables || 0) +
                        (filteredEntries[0]?.wasteOthers || 0),
                    },
                    {
                      name: 'Fuel',
                      value: filteredEntries[0]?.generatorFuelLitres || 0,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 9 }} width={40} />
                  <Tooltip
                    contentStyle={{ fontSize: '11px', padding: '8px' }}
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>

          {/* Recent Activity */}
          <Card className="p-4 sm:p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                Recent Submissions
              </h3>
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/history')}
                className="text-xs"
              >
                View All History
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                    <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Personnel</th>
                    <th className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Consumption Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.slice(0, 5).map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-semibold text-slate-900">{entry.month} {entry.year}</span>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <span className="text-xs text-slate-600">{entry.students} students, {entry.employees} employees</span>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="text-xs text-slate-500 italic">
                          {[
                            entry.electricityUnits ? `${entry.electricityUnits} kWh` : null,
                            entry.waterUnits ? `${entry.waterUnits} m³` : null,
                            entry.paperReams ? `${entry.paperReams} reams` : null
                          ].filter(Boolean).join(', ') || 'Partial data'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

    </div>
  );
}
