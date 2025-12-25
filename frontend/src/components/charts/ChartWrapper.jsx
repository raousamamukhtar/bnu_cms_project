export function ChartWrapper({ title, description, children, actions }) {
  return (
    <div className="glass-card p-4 lg:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}


