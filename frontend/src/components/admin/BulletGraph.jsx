const formatMax = (value) => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
};

const BulletGraph = ({
  value,
  target,
  min = 0,
  max,
  label,
  unit = '',
  ariaLabel,
  className = '',
}) => {
  const safeMax = max || Math.max(value, target || 0) * 1.2;
  const valuePercent = (value / safeMax) * 100;
  const targetPercent = target ? (target / safeMax) * 100 : 0;

  return (
    <div
      className={`space-y-1 ${className}`}
      role="img"
      aria-label={ariaLabel || `${label}: ${value} ${unit}`}
    >
      <div className="flex justify-between items-baseline text-xs">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
          {value.toLocaleString()} {unit}
        </span>
      </div>
      <div className="relative h-2 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-slate-700 dark:bg-slate-500 transition-all duration-300"
          style={{ width: `${Math.min(valuePercent, 100)}%` }}
          aria-hidden="true"
        />
        {target > 0 && (
          <div
            className="absolute top-0 h-full w-px bg-slate-900 dark:bg-slate-200"
            style={{ left: `${targetPercent}%` }}
            aria-label={`Target: ${target} ${unit}`}
          />
        )}
      </div>
      {target > 0 && (
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-500">
          <span>{min}</span>
          <span className="text-slate-700 dark:text-slate-300">
            Target: {target.toLocaleString()}
          </span>
          <span>{formatMax(safeMax)}</span>
        </div>
      )}
    </div>
  );
};

export default BulletGraph;

