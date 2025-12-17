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
import { useData } from '../../context/DataContext';
import { formatNumber, getYearOptions, getDefaultYear } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

// Mock monthly data entries with user-based data
const mockMonthlyEntries = [
  {
    id: 'entry-001',
    userId: 'user-012',
    userName: 'HR Manager',
    userRole: 'hr',
    month: 'December',
    year: '2025',
    students: 320,
    employees: 18,
    paperReams: 85,
    paperSheetsPerReam: 500,
    electricityUnits: 6200,
    waterUnits: 3100,
    waterPricePerUnit: 45,
    wasteOrganic: 220,
    wasteRecyclables: 180,
    wasteOthers: 90,
    generatorAvgHours: 150,
    generatorFuelLitres: 650,
    businessTravelKms: 1800,
    businessTravelFuelLitres: 130,
    status: 'submitted',
  },
  {
    id: 'entry-002',
    userId: 'user-002',
    userName: 'Hasan Ali',
    userRole: 'coordinator',
    month: 'December',
    year: '2025',
    students: 450,
    employees: 25,
    paperReams: 120,
    paperSheetsPerReam: 500,
    electricityUnits: 8320,
    waterUnits: 4220,
    waterPricePerUnit: 45,
    wasteOrganic: 350,
    wasteRecyclables: 280,
    wasteOthers: 120,
    generatorAvgHours: 180,
    generatorFuelLitres: 850,
    businessTravelKms: 2500,
    businessTravelFuelLitres: 180,
    status: 'submitted',
  },
  {
    id: 'entry-003',
    userId: 'user-007',
    userName: 'Fatima Sheikh',
    userRole: 'coordinator',
    month: 'December',
    year: '2025',
    students: 380,
    employees: 22,
    paperReams: 95,
    paperSheetsPerReam: 500,
    electricityUnits: 7200,
    waterUnits: 3600,
    waterPricePerUnit: 45,
    wasteOrganic: 280,
    wasteRecyclables: 220,
    wasteOthers: 100,
    generatorAvgHours: 165,
    generatorFuelLitres: 720,
    businessTravelKms: 2100,
    businessTravelFuelLitres: 150,
    status: 'submitted',
  },
  {
    id: 'entry-004',
    userId: 'user-011',
    userName: 'Ayesha Raza',
    userRole: 'coordinator',
    month: 'November',
    year: '2025',
    students: 520,
    employees: 30,
    paperReams: 140,
    paperSheetsPerReam: 500,
    electricityUnits: 9100,
    waterUnits: 4800,
    waterPricePerUnit: 45,
    wasteOrganic: 420,
    wasteRecyclables: 320,
    wasteOthers: 150,
    generatorAvgHours: 200,
    generatorFuelLitres: 950,
    businessTravelKms: 2800,
    businessTravelFuelLitres: 200,
    status: 'submitted',
  },
];

export default function AdminDashboard() {
  const { users } = useData();
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(getDefaultYear());
  const [selectedUser, setSelectedUser] = useState('all');
  const [monthlyEntries] = useState(mockMonthlyEntries);

  // Reset scroll position on component mount
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Get HR and Coordinator users
  const hrAndCoordinators = useMemo(() => {
    return users.filter((u) => u.role === 'hr' || u.role === 'coordinator');
  }, [users]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    let filtered = monthlyEntries.filter((entry) => entry.year === selectedYear);
    if (selectedUser !== 'all') {
      filtered = filtered.filter((entry) => entry.userId === selectedUser);
    }
    return filtered;
  }, [monthlyEntries, selectedYear, selectedUser]);

  // Calculate stats from monthly entries
  const stats = useMemo(() => {
    const currentMonth = filteredEntries[0];
    const totalEntries = filteredEntries.length;
    const totalWaste = filteredEntries.reduce(
      (sum, entry) => sum + (entry.wasteOrganic || 0) + (entry.wasteRecyclables || 0) + (entry.wasteOthers || 0),
      0,
    );

    return [
      {
        label: 'Total Monthly Entries',
        value: totalEntries,
        trend: totalEntries,
        trendLabel: 'submitted',
      },
      {
        label: 'Current Month - Electricity (kWh)',
        value: currentMonth ? formatNumber(currentMonth.electricityUnits || 0) : '0',
        trend: 2.1,
        trendLabel: 'vs last month',
      },
      {
        label: 'Current Month - Water (m³)',
        value: currentMonth ? formatNumber(currentMonth.waterUnits || 0) : '0',
        trend: 1.8,
        trendLabel: 'vs last month',
      },
      {
        label: 'Total Waste (kg)',
        value: formatNumber(totalWaste),
        trend: 3.2,
        trendLabel: 'this year',
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
            View and manage all monthly environmental data entries by HR and Coordinators
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          <Select
            label="Filter by User"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            options={[
              { label: 'All Users', value: 'all' },
              ...hrAndCoordinators.map((user) => ({
                label: `${user.name} (${user.role === 'hr' ? 'HR' : 'Coordinator'})`,
                value: user.id,
              })),
            ]}
          />
          <Select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={getYearOptions()}
          />
        </div>
      </Card>

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

    </div>
  );
}
