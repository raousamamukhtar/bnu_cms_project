export function ChartWrapper({ title, description, children, actions }) {
  return (
    <div className="glass-card p-4 lg:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description && (
            <p className="text-xs text-slate-500 break-words">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="h-64 sm:h-80 lg:h-96 w-full overflow-x-auto">
        {children}
      </div>
    </div>
  );
}


