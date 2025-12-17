import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { ChartWrapper } from '../../components/charts/ChartWrapper';
import { useData } from '../../context/DataContext';

export default function Analytics() {
  const { departmentMonthlyData } = useData();

  const selectedDepartments = ['Transport', 'IT', 'Finance'];
  const dataset = departmentMonthlyData
    .filter(
      (item) => item.year === 2025 && selectedDepartments.includes(item.department),
    )
    .map((item) => ({
      name: `${item.month.slice(0, 3)} • ${item.department}`,
      transport: item.department === 'Transport' ? item.electricity : null,
      it: item.department === 'IT' ? item.electricity : null,
      finance: item.department === 'Finance' ? item.electricity : null,
    }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Sustainability Cell
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Analytics Lab</h2>
      </div>

      <ChartWrapper
        title="Multi-department electricity trend"
        description="Peaks highlight target opportunity areas"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataset}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="transport" stroke="#f97316" />
            <Line type="monotone" dataKey="it" stroke="#0ea5e9" />
            <Line type="monotone" dataKey="finance" stroke="#8b5cf6" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900">Summary KPIs</h3>
          <p className="text-sm text-slate-500">
            Transport energy is 14% higher than peers ↑
          </p>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900">Alert</h3>
          <p className="text-sm text-slate-500">
            Waste fuel trending upward for Maintenance ↓
          </p>
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900">Action</h3>
          <p className="text-sm text-slate-500">
            Recommend deploying cross-campus energy audit.
          </p>
        </Card>
      </div>
    </div>
  );
}


