export const formatNumber = (value) =>
  Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);

export const formatPercentage = (value) =>
  `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const getTrendStatus = (current, previous) => {
  if (current > previous) return 'negative';
  if (current < previous) return 'positive';
  return 'neutral';
};

export const getTrendArrow = (status) => {
  if (status === 'positive') return '↑';
  if (status === 'negative') return '↓';
  return '→';
};

/**
 * Generates year options for select dropdowns
 * Automatically includes years from a start year to current year + 1
 * @param {number} startYear - Starting year (default: 2023)
 * @param {number} futureYears - Number of future years to include (default: 1)
 * @returns {Array} Array of year option objects with label and value
 */
export const getYearOptions = (startYear = 2023, futureYears = 1) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + futureYears;
  const years = [];
  
  for (let year = startYear; year <= endYear; year++) {
    years.push({ label: year.toString(), value: year.toString() });
  }
  
  return years;
};

/**
 * Gets the default year (current year)
 * @returns {string} Current year as string
 */
export const getDefaultYear = () => {
  return new Date().getFullYear().toString();
};


