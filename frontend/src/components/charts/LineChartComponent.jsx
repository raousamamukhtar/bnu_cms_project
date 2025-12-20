import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { COMPONENT_COLORS, CHART_COLORS } from '../../constants/chartColors';

/**
 * Reusable Line Chart Component
 */
export function LineChartComponent({ title, data, dataKey, color, unit = '', height = 300 }) {
  const tooltipFormatter = unit ? (value) => `${value.toLocaleString()} ${unit}` : undefined;

  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            name={title.replace(' Trend', '')}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

/**
 * Multi-line Chart Component for waste trends
 */
export function MultiLineChartComponent({ title, data, lines, height = 400 }) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 3}
              name={line.name}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              strokeDasharray={line.strokeDasharray}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

