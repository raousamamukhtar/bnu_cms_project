import { Card } from '../ui/Card';
import { WastePieChart } from '../charts/WastePieChart';
import { WasteSegregationCard } from '../charts/WasteSegregationCard';

const WASTE_DESCRIPTIONS = {
  organic: 'Food scraps, garden waste, and biodegradable materials. Can be composted into valuable fertilizer, reducing landfill burden.',
  recyclables: 'Paper, plastic, glass, and metal that can be processed and reused. Reduces resource consumption and supports the circular economy.',
  others: 'Non-recyclable and non-compostable materials requiring special handling. May include hazardous materials or mixed waste.',
};

/**
 * Waste Segregation Section Component
 * Displays pie chart and detailed waste information cards
 */
export function WasteSegregationSection({ year, wasteData }) {
  const total = wasteData.total;
  const organicPercentage = ((wasteData.organic / total) * 100).toFixed(1);
  const recyclablesPercentage = ((wasteData.recyclables / total) * 100).toFixed(1);
  const othersPercentage = ((wasteData.others / total) * 100).toFixed(1);

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Waste Segregation Analysis - {year}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WastePieChart data={wasteData} />
        <div className="space-y-3">
          <WasteSegregationCard
            title="Organic Waste"
            value={wasteData.organic}
            percentage={organicPercentage}
            description={WASTE_DESCRIPTIONS.organic}
            colorVariant="emerald"
          />
          <WasteSegregationCard
            title="Recyclables"
            value={wasteData.recyclables}
            percentage={recyclablesPercentage}
            description={WASTE_DESCRIPTIONS.recyclables}
            colorVariant="blue"
          />
          <WasteSegregationCard
            title="Others"
            value={wasteData.others}
            percentage={othersPercentage}
            description={WASTE_DESCRIPTIONS.others}
            colorVariant="orange"
          />
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3.5 border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-900 mb-1.5 text-sm">Total Waste Generated</h4>
            <p className="text-xl font-bold text-slate-900 mb-1">
              {total.toLocaleString()} kg
            </p>
            <p className="text-[10px] text-slate-500">
              Per capita: {wasteData.perCapitaGeneration} kg per person
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

