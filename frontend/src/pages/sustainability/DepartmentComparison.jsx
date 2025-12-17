import { useData } from '../../context/DataContext';

const metrics = [
  { key: 'efficiencyScore', label: 'Efficiency' },
  { key: 'renewableUsage', label: 'Renewables' },
  { key: 'emissions', label: 'Emissions' },
  { key: 'paperReduction', label: 'Paper ↓' },
];

const getHeatClass = (value, invert = false) => {
  if (invert) {
    if (value > 180) return 'bg-rose-100 text-rose-700';
    if (value > 140) return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
  }
  if (value > 80) return 'bg-emerald-100 text-emerald-700';
  if (value > 60) return 'bg-amber-100 text-amber-700';
  return 'bg-rose-100 text-rose-700';
};

export default function DepartmentComparison() {
  const { departmentComparison } = useData();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Sustainability Cell
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Department Heatmap
        </h2>
      </div>

      <div className="overflow-auto glass-card p-0">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">
                Department
              </th>
              {metrics.map((metric) => (
                <th
                  key={metric.key}
                  className="text-left px-4 py-3 text-xs font-semibold text-slate-500"
                >
                  {metric.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departmentComparison.map((row) => (
              <tr key={row.department} className="border-t border-slate-100/60">
                <td className="px-4 py-3 font-medium text-slate-800">
                  {row.department}
                </td>
                {metrics.map((metric) => (
                  <td key={metric.key} className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getHeatClass(
                        row[metric.key],
                        metric.key === 'emissions',
                      )}`}
                    >
                      {row[metric.key]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


