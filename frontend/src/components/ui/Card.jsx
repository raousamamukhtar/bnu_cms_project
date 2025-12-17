export function Card({ className = '', children }) {
  return (
    <div className={`glass-card p-4 lg:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, trend, trendLabel }) {
  const positive = trend && trend > 0;
  const negative = trend && trend < 0;

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      {trend != null && (
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              positive
                ? 'bg-emerald-50 text-emerald-600'
                : negative
                  ? 'bg-red-50 text-red-600'
                  : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span>{positive ? '↑' : negative ? '↓' : '→'}</span>
            <span>{Math.abs(trend)}%</span>
          </span>
          {trendLabel && (
            <span className="text-slate-500">{trendLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}

export function InfoCard({ title, description, children }) {
  return (
    <Card className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </Card>
  );
}


