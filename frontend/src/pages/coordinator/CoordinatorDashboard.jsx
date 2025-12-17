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

// Mock data - in real app, this would come from API
const mockCarbonData = [
  { month: 'Jan', carbonFootprint: 45.2 },
  { month: 'Feb', carbonFootprint: 42.8 },
  { month: 'Mar', carbonFootprint: 48.5 },
  { month: 'Apr', carbonFootprint: 44.1 },
  { month: 'May', carbonFootprint: 46.3 },
  { month: 'Jun', carbonFootprint: 43.7 },
];

const mockAQIData = [
  { month: 'Jan', aqi: 65, pm25: 42, pm10: 58 },
  { month: 'Feb', aqi: 58, pm25: 38, pm10: 52 },
  { month: 'Mar', aqi: 72, pm25: 48, pm10: 65 },
  { month: 'Apr', aqi: 68, pm25: 45, pm10: 61 },
  { month: 'May', aqi: 70, pm25: 46, pm10: 63 },
  { month: 'Jun', aqi: 64, pm25: 41, pm10: 57 },
];

const mockEventsLog = [
  {
    id: 'evt-001',
    event: 'Carbon Footprint Assessment',
    date: '2025-10-15',
    type: 'Assessment',
    status: 'Completed',
  },
  {
    id: 'evt-002',
    event: 'AQI Monitoring Setup',
    date: '2025-10-20',
    type: 'Setup',
    status: 'Completed',
  },
  {
    id: 'evt-003',
    event: 'Monthly Carbon Review',
    date: '2025-11-01',
    type: 'Review',
    status: 'Scheduled',
  },
  {
    id: 'evt-004',
    event: 'AQI Data Collection',
    date: '2025-11-05',
    type: 'Data Collection',
    status: 'In Progress',
  },
];

export default function CoordinatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const myDept = user?.department;

  // Calculate stats
  const avgCarbon =
    mockCarbonData.length > 0
      ? formatNumber(
          mockCarbonData.reduce((acc, row) => acc + row.carbonFootprint, 0) /
            mockCarbonData.length,
        )
      : '–';

  const avgAQI =
    mockAQIData.length > 0
      ? formatNumber(
          mockAQIData.reduce((acc, row) => acc + row.aqi, 0) /
            mockAQIData.length,
        )
      : '–';

  const stats = [
    {
      label: 'Avg Carbon Footprint (tCO₂e)',
      value: avgCarbon,
      trend: -2.5,
      trendLabel: 'vs last period',
    },
    {
      label: 'Avg AQI',
      value: avgAQI,
      trend: -3,
      trendLabel: 'vs last period',
    },
    {
      label: 'Total Events',
      value: mockEventsLog.length,
      trend: 2,
      trendLabel: 'this month',
    },
    {
      label: 'Pending Events',
      value: mockEventsLog.filter((e) => e.status !== 'Completed').length,
      trend: 1,
      trendLabel: 'active',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-white">
            <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
              Coordinator - {myDept || 'Department'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Coordinator Dashboard
            </h2>
            <p className="text-sm text-emerald-50">
              Monitor Carbon Data, AQI Data, and Events Log
            </p>
          </div>
          <Button 
            onClick={() => navigate('/coordinator/data-entry')}
            className="whitespace-nowrap text-black bg-white/90 hover:bg-white  font-semibold shadow-md"
          >
            New Data Entry
          </Button>
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
              Monthly carbon footprint trends for {myDept || 'department'}
            </p>
          </div>
          <div className="p-4 sm:p-5">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockCarbonData}>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAQIData}>
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
                <Bar dataKey="pm25" fill="#6366f1" name="PM2.5" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pm10" fill="#f97316" name="PM10" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      
    </div>
  );
}
