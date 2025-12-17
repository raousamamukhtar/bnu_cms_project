import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { useData } from '../../context/DataContext';

export default function DepartmentTrends() {
  const { departmentMonthlyData } = useData();

  const focusDepartments = ['HR', 'Transport', 'Academic Departments'];
  const chartData = months().map((month) => {
    const monthData = { month };
    focusDepartments.forEach((dept) => {
      const record = departmentMonthlyData.find(
        (item) =>
          item.year === 2025 && item.month === month && item.department === dept,
      );
      monthData[dept] = record?.electricity ?? 0;
    });
    return monthData;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Management
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Department Trends
        </h2>
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 mb-4">
          Electricity Consumption
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {focusDepartments.map((dept) => (
              <Line key={dept} type="monotone" dataKey={dept} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function months() {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}


