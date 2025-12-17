import { StatCard, Card } from '../../components/ui/Card';
import { useData } from '../../context/DataContext';

export default function UniversityKPI() {
  const { kpiTargets, trendHighlights } = useData();

  const formatTrend = (current, target) => {
    if (!target) return 0;
    const pct = ((current - target) / target) * 100;
    return Number(pct.toPrecision(2));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">
          Management
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          University KPI Board
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiTargets.map((kpi) => (
          <StatCard
            key={kpi.kpi}
            label={kpi.kpi}
            value={`${kpi.current}/${kpi.target}`}
            trend={formatTrend(kpi.current, kpi.target)}
            trendLabel="vs annual target"
          />
        ))}
      </div>

      <Card>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <p className="text-xs uppercase text-slate-400">
                {highlight.status === 'positive'
                  ? 'On Track'
                  : highlight.status === 'negative'
                    ? 'At Risk'
                    : 'Stable'}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {highlight.title}
              </p>
              <p className="text-sm text-slate-500">{highlight.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


