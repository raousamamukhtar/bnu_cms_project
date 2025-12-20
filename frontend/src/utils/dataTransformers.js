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
  return monthlyData.map((entry) => ({
    month: entry.period.month.substring(0, 3),
    fullMonth: entry.period.month,
    paper: entry.paper.reams,
    electricity: entry.electricity.units,
    water: entry.water.units,
    generator: entry.generator.fuelLitres,
    travel: entry.travel.businessKms,
    wasteOrganic: entry.waste.organic,
    wasteRecyclables: entry.waste.recyclables,
    wasteOthers: entry.waste.others,
    wasteTotal: entry.waste.total,
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

