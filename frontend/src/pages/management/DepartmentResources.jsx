import { useState, useMemo } from 'react';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { useData } from '../../context/DataContext';

const monthOrder = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function DepartmentResources() {
  const { departments, departmentMonthlyData } = useData();
  const [selectedDept, setSelectedDept] = useState(departments[0] || '');

  const currentYear = new Date().getFullYear();

  const departmentOptions = departments.map((dept) => ({
    label: dept,
    value: dept,
  }));

  const filteredData = useMemo(() => {
    if (!selectedDept) return [];
    return departmentMonthlyData
      .filter(
        (item) =>
          item.department === selectedDept && item.year === currentYear,
      )
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  }, [selectedDept, departmentMonthlyData, currentYear]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        paper: acc.paper + (item.paper || 0),
        electricity: acc.electricity + (item.electricity || 0),
        water: acc.water + (item.water || 0),
        travel: acc.travel + (item.travel || 0),
        wasteFuel: acc.wasteFuel + (item.wasteFuel || 0),
      }),
      { paper: 0, electricity: 0, water: 0, travel: 0, wasteFuel: 0 },
    );
  }, [filteredData]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const columns = [
    { header: 'Month', accessor: 'month' },
    {
      header: 'Paper',
      accessor: 'paper',
      cell: (row) => formatNumber(row.paper),
    },
    {
      header: 'Electricity (kWh)',
      accessor: 'electricity',
      cell: (row) => formatNumber(row.electricity),
    },
    {
      header: 'Water (L)',
      accessor: 'water',
      cell: (row) => formatNumber(row.water),
    },
    {
      header: 'Travel (km)',
      accessor: 'travel',
      cell: (row) => formatNumber(row.travel),
    },
    {
      header: 'Waste/Fuel',
      accessor: 'wasteFuel',
      cell: (row) => formatNumber(row.wasteFuel),
    },
  ];

  const statCards = [
    {
      label: 'Total Paper',
      value: formatNumber(totals.paper),
      trend: null,
      trendLabel: null,
    },
    {
      label: 'Total Electricity',
      value: formatNumber(totals.electricity),
      trend: null,
      trendLabel: null,
    },
    {
      label: 'Total Water',
      value: formatNumber(totals.water),
      trend: null,
      trendLabel: null,
    },
    {
      label: 'Total Travel',
      value: formatNumber(totals.travel),
      trend: null,
      trendLabel: null,
    },
    {
      label: 'Total Waste/Fuel',
      value: formatNumber(totals.wasteFuel),
      trend: null,
      trendLabel: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Management
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Department Resource Consumption
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Select
          label="Select Department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          options={departmentOptions}
          className="w-64"
        />
        <div className="text-sm text-slate-600 mt-6">
          Year: <span className="font-semibold">{currentYear}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Monthly Resource Consumption - {selectedDept}
        </h3>
        {filteredData.length > 0 ? (
          <Table columns={columns} data={filteredData} />
        ) : (
          <div className="text-center py-8 text-slate-500">
            No data available for {selectedDept} in {currentYear}
          </div>
        )}
      </Card>
    </div>
  );
}

