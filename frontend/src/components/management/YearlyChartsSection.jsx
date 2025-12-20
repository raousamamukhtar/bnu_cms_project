import { LineChartComponent, MultiLineChartComponent } from '../charts/LineChartComponent';
import { COMPONENT_COLORS, CHART_COLORS } from '../../constants/chartColors';

/**
 * Yearly Charts Section Component
 * Displays all trend charts for yearly view
 */
export function YearlyChartsSection({ year, chartData }) {
  const wasteTrendLines = [
    {
      dataKey: 'wasteOrganic',
      color: COMPONENT_COLORS.waste.organic,
      name: 'Organic (kg)',
      strokeWidth: 3,
    },
    {
      dataKey: 'wasteRecyclables',
      color: COMPONENT_COLORS.waste.recyclables,
      name: 'Recyclables (kg)',
      strokeWidth: 3,
    },
    {
      dataKey: 'wasteOthers',
      color: COMPONENT_COLORS.waste.others,
      name: 'Others (kg)',
      strokeWidth: 3,
    },
    {
      dataKey: 'wasteTotal',
      color: CHART_COLORS.danger,
      name: 'Total Waste (kg)',
      strokeWidth: 3,
      strokeDasharray: '5 5',
    },
  ];

  return (
    <>
      {/* Waste Trend Line Chart */}
      <MultiLineChartComponent
        title={`Waste Generation Trends - ${year}`}
        data={chartData}
        lines={wasteTrendLines}
        height={400}
      />

      {/* Component Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartComponent
          title={`Paper Consumption Trend - ${year}`}
          data={chartData}
          dataKey="paper"
          color={COMPONENT_COLORS.paper}
          height={300}
        />
        <LineChartComponent
          title={`Electricity Consumption Trend - ${year}`}
          data={chartData}
          dataKey="electricity"
          color={COMPONENT_COLORS.electricity}
          unit="kWh"
          height={300}
        />
        <LineChartComponent
          title={`Water Consumption Trend - ${year}`}
          data={chartData}
          dataKey="water"
          color={COMPONENT_COLORS.water}
          unit="m³"
          height={300}
        />
        <LineChartComponent
          title={`Generator Fuel Consumption Trend - ${year}`}
          data={chartData}
          dataKey="generator"
          color={COMPONENT_COLORS.generator}
          unit="L"
          height={300}
        />
        <LineChartComponent
          title={`Business Travel Trend - ${year}`}
          data={chartData}
          dataKey="travel"
          color={COMPONENT_COLORS.travel}
          unit="km"
          height={300}
        />
      </div>
    </>
  );
}

