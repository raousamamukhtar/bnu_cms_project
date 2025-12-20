import { MetricCard, MetricRow } from './MetricCard';

const METRIC_CONFIG = {
  paper: {
    title: 'Paper Consumption',
    iconColor: 'bg-emerald-500',
    fields: [
      { label: 'Reams:', key: 'reams', format: (v) => v },
      { label: 'Total Sheets:', key: 'totalSheets', format: (v) => v.toLocaleString() },
      { label: 'Per Capita:', key: 'perCapitaReams', format: (v) => `${v} reams` },
    ],
  },
  electricity: {
    title: 'Electricity',
    iconColor: 'bg-blue-500',
    fields: [
      { label: 'Units (kWh):', key: 'units', format: (v) => v.toLocaleString() },
      { label: 'Total Cost:', key: 'totalCost', format: (v) => `PKR ${(v / 1000000).toFixed(2)}M` },
      { label: 'Per Unit Rate:', key: 'perUnitRate', format: (v) => `PKR ${v}` },
      { label: 'Per Capita:', key: 'perCapitaConsumption', format: (v) => `${v} kWh` },
    ],
  },
  water: {
    title: 'Water Consumption',
    iconColor: 'bg-cyan-500',
    fields: [
      { label: 'Units (m³):', key: 'units', format: (v) => v.toLocaleString() },
      { label: 'Total Cost:', key: 'totalCost', format: (v) => `PKR ${(v / 1000000).toFixed(2)}M` },
      { label: 'Price/Unit:', key: 'pricePerUnit', format: (v) => `PKR ${v}` },
      { label: 'Per Capita:', key: 'perCapitaConsumption', format: (v) => `${v} m³` },
    ],
  },
  waste: {
    title: 'Waste Generation',
    iconColor: 'bg-orange-500',
    fields: [
      { label: 'Organic:', key: 'organic', format: (v) => `${v} kg` },
      { label: 'Recyclables:', key: 'recyclables', format: (v) => `${v} kg` },
      { label: 'Others:', key: 'others', format: (v) => `${v} kg` },
      { label: 'Total:', key: 'total', format: (v) => `${v} kg` },
      { label: 'Per Capita:', key: 'perCapitaGeneration', format: (v) => `${v} kg` },
    ],
  },
  generator: {
    title: 'Generator Usage',
    iconColor: 'bg-amber-500',
    fields: [
      { label: 'Avg. Hours:', key: 'avgRunningHours', format: (v) => v.toLocaleString() },
      { label: 'Fuel (Litres):', key: 'fuelLitres', format: (v) => v.toLocaleString() },
    ],
  },
  travel: {
    title: 'Business Travel',
    iconColor: 'bg-red-500',
    fields: [
      { label: 'Distance (km):', key: 'businessKms', format: (v) => v.toLocaleString() },
      { label: 'Fuel (Litres):', key: 'fuelLitres', format: (v) => v.toLocaleString() },
    ],
  },
};

/**
 * Detailed Metrics Grid Component
 * Displays all metrics in a grid layout
 */
export function DetailedMetricsGrid({ data, viewType }) {
  const periodLabel = viewType === 'yearly' 
    ? `${data.period.year} (Yearly Aggregated)`
    : `${data.period.month} ${data.period.year}`;

  return (
    <div className="overflow-x-auto">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Detailed Metrics for {periodLabel}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(METRIC_CONFIG).map(([key, config]) => (
          <MetricCard key={key} title={config.title} iconColor={config.iconColor}>
            {config.fields.map((field) => (
              <MetricRow
                key={field.key}
                label={field.label}
                value={field.format(data[key][field.key])}
              />
            ))}
          </MetricCard>
        ))}
      </div>
    </div>
  );
}

