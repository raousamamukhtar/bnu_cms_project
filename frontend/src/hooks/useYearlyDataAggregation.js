import { useMemo } from 'react';

/**
 * Custom hook to aggregate monthly data into yearly data
 * @param {Array} monthlyData - Array of monthly data entries
 * @param {string} selectedYear - Year to filter and aggregate
 * @returns {Object|null} Aggregated yearly data or null if no data
 */
export function useYearlyDataAggregation(monthlyData, selectedYear) {
  return useMemo(() => {
    const filteredData = monthlyData.filter(
      (entry) => entry.period.year == selectedYear
    );

    if (filteredData.length === 0) return null;

    // Calculate average monthly personnel
    const avgPersonnel = {
      students: Math.round(
        filteredData.reduce((sum, entry) => sum + entry.personnel.students, 0) /
        filteredData.length
      ),
      employees: Math.round(
        filteredData.reduce((sum, entry) => sum + entry.personnel.employees, 0) /
        filteredData.length
      ),
      total: Math.round(
        filteredData.reduce((sum, entry) => sum + entry.personnel.total, 0) /
        filteredData.length
      ),
    };

    // Aggregate all metrics
    const aggregated = filteredData.reduce(
      (acc, entry) => {
        if (entry.paper) {
          acc.paper.reams += entry.paper.reams || 0;
          acc.paper.totalSheets += entry.paper.totalSheets || 0;
        }

        if (entry.electricity) {
          acc.electricity.units += entry.electricity.units || 0;
          acc.electricity.totalCost += entry.electricity.totalCost || 0;
        }

        if (entry.water) {
          acc.water.units += entry.water.units || 0;
          acc.water.totalCost += entry.water.totalCost || 0;
        }

        if (entry.waste) {
          acc.waste.organic += entry.waste.organic || 0;
          acc.waste.recyclables += entry.waste.recyclables || 0;
          acc.waste.others += entry.waste.others || 0;
          acc.waste.total += entry.waste.total || 0;
        }

        if (entry.generator) {
          acc.generator.avgRunningHours += entry.generator.avgRunningHours || 0;
          acc.generator.fuelLitres += entry.generator.fuelLitres || 0;
        }



        if (entry.carbon) {
          acc.carbon.aqiTotal += entry.carbon.aqi || 0;
          acc.carbon.carbonFootprint += entry.carbon.carbonFootprint || 0;
          acc.carbon.count += 1;
        }

        return acc;
      },
      {
        period: { month: 'Year', year: selectedYear },
        personnel: avgPersonnel,
        paper: {
          reams: 0,
          sheetsPerReam: 500,
          totalSheets: 0,
          perCapitaReams: '0',
        },
        electricity: {
          units: 0,
          perUnitRate: 0,
          totalCost: 0,
          perUnitCost: 0,
          perCapitaConsumption: 0,
        },
        water: {
          units: 0,
          pricePerUnit: 0,
          totalCost: 0,
          perCapitaConsumption: '0',
        },
        waste: {
          organic: 0,
          recyclables: 0,
          others: 0,
          total: 0,
          perCapitaGeneration: '0',
        },
        generator: { avgRunningHours: 0, fuelLitres: 0 },
        carbon: { aqiTotal: 0, carbonFootprint: 0, count: 0 },
        submittedAt: new Date().toISOString(),
        submittedBy: 'admin',
      }
    );

    // Calculate derived metrics
    const totalPersonnelMonths = avgPersonnel.total * filteredData.length;

    aggregated.paper.perCapitaReams = (
      aggregated.paper.reams / totalPersonnelMonths
    ).toFixed(3);

    aggregated.electricity.perUnitRate =
      aggregated.electricity.units > 0
        ? Math.round(aggregated.electricity.totalCost / aggregated.electricity.units)
        : 0;
    aggregated.electricity.perUnitCost = aggregated.electricity.perUnitRate;
    aggregated.electricity.perCapitaConsumption =
      totalPersonnelMonths > 0
        ? Math.round(aggregated.electricity.units / totalPersonnelMonths)
        : 0;

    aggregated.water.pricePerUnit =
      aggregated.water.units > 0
        ? Math.round(aggregated.water.totalCost / aggregated.water.units)
        : 0;
    aggregated.water.perCapitaConsumption =
      totalPersonnelMonths > 0
        ? (aggregated.water.units / totalPersonnelMonths).toFixed(3)
        : '0';

    aggregated.waste.perCapitaGeneration =
      totalPersonnelMonths > 0
        ? (aggregated.waste.total / totalPersonnelMonths).toFixed(3)
        : '0';

    // Calculate yearly Carbon & AQI
    if (aggregated.carbon.count > 0) {
      aggregated.carbon = {
        aqi: Math.round(aggregated.carbon.aqiTotal / aggregated.carbon.count),
        carbonFootprint: parseFloat(aggregated.carbon.carbonFootprint.toFixed(2)),
      };
    } else {
      aggregated.carbon = { aqi: 0, carbonFootprint: 0 };
    }

    return aggregated;
  }, [monthlyData, selectedYear]);
}

