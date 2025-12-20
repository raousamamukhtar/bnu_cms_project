import { useMemo } from 'react';

/**
 * Custom hook to extract and sort available years from monthly data
 * @param {Array} monthlyData - Array of monthly data entries
 * @returns {Array} Sorted array of available years (newest first)
 */
export function useAvailableYears(monthlyData) {
  return useMemo(() => {
    const years = [...new Set(monthlyData.map((entry) => entry.period.year))];
    return years.sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
  }, [monthlyData]);
}

