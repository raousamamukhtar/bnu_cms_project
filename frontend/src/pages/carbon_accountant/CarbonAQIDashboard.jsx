import { useState, useEffect, useMemo } from 'react';
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { StatCard, Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { formatNumber } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { carbonService } from '../../services/carbonService';

export default function CarbonAQIDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await carbonService.getCarbonData();

        // Transform API response to match expected format
        const transformedData = data.map(entry => ({
          month: entry.month,
          monthAbbr: entry.month.substring(0, 3),
          year: entry.year,
          aqi: parseFloat(entry.aqi) || 0,
          carbonFootprint: parseFloat(entry.carbonFootprint) || 0,
          pm25: 0, // Not in current schema
          pm10: 0, // Not in current schema
        }));

        setEntries(transformedData);
      } catch (error) {
        console.error('Error loading carbon accountant data:', error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Transform entries for charts
  const carbonData = useMemo(() => {
    return entries.map(entry => ({
      month: entry.monthAbbr,
      carbonFootprint: entry.carbonFootprint,
    }));
  }, [entries]);

  const aqiData = useMemo(() => {
    return entries.map(entry => ({
      month: entry.monthAbbr,
      aqi: entry.aqi,
      pm25: entry.pm25 || 0,
      pm10: entry.pm10 || 0,
    }));
  }, [entries]);

  // Calculate stats
  const avgCarbon = useMemo(() => {
    if (entries.length === 0) return '–';
    const total = entries.reduce((acc, entry) => acc + entry.carbonFootprint, 0);
    return formatNumber(total / entries.length);
  }, [entries]);

  const avgAQI = useMemo(() => {
    if (entries.length === 0) return '–';
    const total = entries.reduce((acc, entry) => acc + entry.aqi, 0);
    return formatNumber(total / entries.length);
  }, [entries]);

  const latestCarbon = useMemo(() => {
    if (entries.length === 0) return '–';
    return formatNumber(entries[entries.length - 1]?.carbonFootprint || 0);
  }, [entries]);

  const stats = [
    {
      label: 'Avg Carbon Footprint (tCO₂e)',
      value: avgCarbon,
      trend: entries.length > 1 ? -2.5 : 0,
      trendLabel: entries.length > 1 ? 'vs last period' : 'no data',
    },
    {
      label: 'Avg AQI',
      value: avgAQI,
      trend: entries.length > 1 ? -3 : 0,
      trendLabel: entries.length > 1 ? 'vs last period' : 'no data',
    },
    {
      label: 'Total Months',
      value: entries.length,
      trend: entries.length > 0 ? entries.length : 0,
      trendLabel: 'entries',
    },
    {
      label: 'Latest Carbon (tCO₂e)',
      value: latestCarbon,
      trend: entries.length > 0 ? 1.2 : 0,
      trendLabel: 'current',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              Carbon Accountant
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Carbon & AQI Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              Monitor Carbon Data, AQI Data, and Environmental Metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/carbon-accountant/history')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              History
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/carbon-accountant/data-entry')}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-slate-900 font-semibold shadow-md border-0"
            >
              New Data Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Carbon Data Chart */}
        <Card className="overflow-hidden">
          <div className="p-4 sm:p-5 pb-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Carbon Data
            </h3>
            <p className="text-xs text-slate-500 mt-1 break-words">
              Monthly carbon footprint trends
            </p>
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-slate-500">Loading data...</p>
              </div>
            ) : carbonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px' }}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="carbonFootprint"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Carbon Footprint (tCO₂e)"
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-slate-500">No carbon data available. Please add data entries.</p>
              </div>
            )}
          </div>
        </Card>

        {/* AQI Data Chart */}
        <Card className="overflow-hidden">
          <div className="p-4 sm:p-5 pb-0">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              AQI Data
            </h3>
            <p className="text-xs text-slate-500 mt-1 break-words">
              Air Quality Index and particulate matter levels
            </p>
          </div>
          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-slate-500">Loading data...</p>
              </div>
            ) : aqiData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aqiData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px' }}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <Bar dataKey="aqi" fill="#0ea5e9" name="AQI" radius={[8, 8, 0, 0]} />
                  {aqiData.some(d => d.pm25 > 0) && (
                    <Bar dataKey="pm25" fill="#6366f1" name="PM2.5" radius={[8, 8, 0, 0]} />
                  )}
                  {aqiData.some(d => d.pm10 > 0) && (
                    <Bar dataKey="pm10" fill="#f97316" name="PM10" radius={[8, 8, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-slate-500">No AQI data available. Please add data entries.</p>
              </div>
            )}
          </div>
        </Card>
      </div>


    </div>
  );
}


