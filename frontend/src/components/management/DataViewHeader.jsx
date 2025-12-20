import { Select } from '../ui/Select';

/**
 * Data View Header Component
 * Header section with title, description, and view type selectors
 */
export function DataViewHeader({ viewType, onViewTypeChange, selectedMonth, onMonthChange, monthOptions, selectedYear, onYearChange, yearOptions, showMonthSelector, showYearSelector }) {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg border border-emerald-800/20 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-white">
          <p className="text-xs uppercase tracking-widest text-emerald-100 font-semibold mb-2">
            Data Analysis
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Environmental Data
          </h1>
          <p className="text-sm text-emerald-50">
            Choose to view monthly or yearly aggregated data
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-full sm:w-auto min-w-[200px]">
            <label className="block text-sm font-medium text-white mb-2">
              View Type
            </label>
            <Select
              value={viewType}
              onChange={(e) => onViewTypeChange(e.target.value)}
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
          </div>
          {showMonthSelector && (
            <div className="w-full sm:w-auto min-w-[200px]">
              <label className="block text-sm font-medium text-white mb-2">
                Select Month
              </label>
              <Select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                options={monthOptions}
              />
            </div>
          )}
          {showYearSelector && (
            <div className="w-full sm:w-auto min-w-[200px]">
              <label className="block text-sm font-medium text-white mb-2">
                Select Year
              </label>
              <Select
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                options={yearOptions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

