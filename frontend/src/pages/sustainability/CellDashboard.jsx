import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StatCard, Card } from '../../components/ui/Card';
import { ChartWrapper } from '../../components/charts/ChartWrapper';
import { Table } from '../../components/ui/Table';
import { useData } from '../../context/DataContext';

export default function CellDashboard() {
  const { monthlyKpiData, trendHighlights, impactInitiatives } = useData();

  const recent = monthlyKpiData.filter((item) => item.year === 2025);

  const columns = [
    { header: 'Initiative', accessor: 'title' },
    { header: 'Department', accessor: 'department' },
    { header: 'Status', accessor: 'status' },
    { header: 'Impact', accessor: 'impact' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Sustainability Cell
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Impact Command Center
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendHighlights.map((highlight) => (
          <StatCard
            key={highlight.title}
            label={highlight.title}
            value={highlight.value}
            trend={highlight.status === 'positive' ? 8 : -4}
            trendLabel={highlight.detail}
          />
        ))}
      </div>

      <ChartWrapper
        title="Multi-year KPI trends"
        description="Paper, electricity, and water usage"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={recent}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="paper"
              stroke="#10b981"
              fill="#6ee7b7"
            />
            <Area
              type="monotone"
              dataKey="electricity"
              stroke="#0ea5e9"
              fill="#bae6fd"
            />
            <Area
              type="monotone"
              dataKey="water"
              stroke="#6366f1"
              fill="#c7d2fe"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Impact Initiatives
          </h3>
          <Table columns={columns} data={impactInitiatives} />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">
            Quick Notes
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• Prioritize travel emission mitigation plans.</li>
            <li>• Expand zero-waste pilots to academic buildings.</li>
            <li>• Collaborate with Transport for electric fleet rollout.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}


