/**
 * Metric Card Component
 * Reusable component for displaying metric information in a card format
 */
export function MetricCard({ title, iconColor = 'bg-emerald-500', children }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${iconColor}`}></span>
        {title}
      </h4>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

/**
 * Metric Row Component
 * Displays a label-value pair within a metric card
 */
export function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-700 font-medium">{label}</span>
      <span className="text-slate-900 font-bold">{value}</span>
    </div>
  );
}

