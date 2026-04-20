/**
 * Data transformation utilities
 * Functions to transform raw data into chart-ready formats
 */

/**
 * Transforms monthly data into chart-ready format for yearly trends
 * @param {Array} monthlyData - Array of monthly data entries
 * @returns {Array} Transformed data with month abbreviations and component values
 */
export function transformMonthlyDataForChart(monthlyData) {
  const monthOrder = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
    'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
  };

  // Sort by Year (Descending) then by Month (Descending) to get latest first
  const sorted = [...monthlyData].sort((a, b) => {
    if (a.period.year !== b.period.year) {
      return b.period.year - a.period.year;
    }
    return (monthOrder[b.period.month] || 0) - (monthOrder[a.period.month] || 0);
  });

  // Take the 12 most recent months
  const latest12 = sorted.slice(0, 12);

  // Return them in chronological order (Ascending) for the chart
  return latest12
    .reverse()
    .map((entry) => ({
      month: `${entry.period.month.substring(0, 3)} ${entry.period.year.toString().slice(-2)}`,
      fullMonth: `${entry.period.month} ${entry.period.year}`,
      paper: entry.paper?.reams || 0,
      electricity: entry.electricity?.units || 0,
      water: entry.water?.units || 0,
      generator: entry.generator?.fuelLitres || 0,
      wasteOrganic: entry.waste?.organic || 0,
      wasteRecyclables: entry.waste?.recyclables || 0,
      wasteOthers: entry.waste?.others || 0,
      wasteTotal: entry.waste?.total || 0,
      aqi: entry.carbon?.aqi || 0,
      carbonFootprint: entry.carbon?.carbonFootprint || 0,
    }));
}

/**
 * Transforms waste data into pie chart format
 * @param {Object} wasteData - Waste data object with organic, recyclables, others
 * @returns {Array} Array of pie chart data points
 */
export function transformWasteDataForPieChart(wasteData) {
  return [
    { name: 'Organic', value: wasteData.organic },
    { name: 'Recyclables', value: wasteData.recyclables },
    { name: 'Others', value: wasteData.others },
  ];
}

