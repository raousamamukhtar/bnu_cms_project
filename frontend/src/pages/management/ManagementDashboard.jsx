import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { StatCard, Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';

export default function ManagementDashboard() {
  const { departmentRanking, kpiTargets } = useData();

  const stats = kpiTargets.map((target) => ({
    label: `${target.kpi} target`,
    value: `${target.current}/${target.target}`,
    trend:
      Math.round(((target.target - target.current) / target.target) * 100 * -1) ||
      0,
    trendLabel: 'progress',
  }));

  const columns = [
    { header: 'Department', accessor: 'department' },
    { header: 'Consumption Score', accessor: 'consumptionScore' },
    { header: 'YoY Improvement', accessor: 'yoyImprovement' },
    { header: 'Renewable Share %', accessor: 'renewableShare' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Management (View-Only)
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          University Snapshot
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          View-only access to all dashboards and reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Consumption Ranking
          </h3>
          <Table columns={columns} data={departmentRanking} />
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            YoY Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentRanking.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="department" />
              <Tooltip />
              <Bar dataKey="yoyImprovement" fill="#0ea5e9" radius={12} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

    </div>
  );
}


