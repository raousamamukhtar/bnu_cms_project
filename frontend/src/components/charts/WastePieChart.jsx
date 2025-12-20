import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';
import { CHART_COLOR_PALETTE, COMPONENT_COLORS } from '../../constants/chartColors';

/**
 * Waste Segregation Pie Chart Component
 */
export function WastePieChart({ title, data }) {
  const pieData = [
    { name: 'Organic', value: data.organic },
    { name: 'Recyclables', value: data.recyclables },
    { name: 'Others', value: data.others },
  ];

  const colors = [
    COMPONENT_COLORS.waste.organic,
    COMPONENT_COLORS.waste.recyclables,
    COMPONENT_COLORS.waste.others,
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) =>
              `${name}: ${value.toLocaleString()}kg (${(percent * 100).toFixed(1)}%)`
            }
            outerRadius={140}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString()} kg`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

