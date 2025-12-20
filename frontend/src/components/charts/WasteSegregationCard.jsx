/**
 * Waste Segregation Card Component
 * Displays information about a waste type with styled card design
 */
const COLOR_VARIANTS = {
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    text: 'text-orange-700',
  },
};

export function WasteSegregationCard({ title, value, percentage, description, colorVariant = 'emerald' }) {
  const colors = COLOR_VARIANTS[colorVariant] || COLOR_VARIANTS.emerald;

  return (
    <div className={`${colors.bg} rounded-xl p-3.5 border ${colors.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`h-3 w-3 rounded-full ${colors.dot} shadow-sm`}></div>
        <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
      </div>
      <p className={`text-xs font-semibold ${colors.text} mb-1.5`}>
        {value.toLocaleString()} kg ({percentage}% of total)
      </p>
      <p className="text-[10px] leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

