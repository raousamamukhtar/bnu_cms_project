export function DatePicker({ label, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-600">{label}</label>
      )}
      <input
        type="date"
        className="h-10 px-3 rounded-xl border border-slate-200 bg-white/80 text-sm text-slate-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        {...props}
      />
    </div>
  );
}


