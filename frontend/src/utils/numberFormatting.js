export const formatSignificantDigits = (value, maxDigits = 3) => {
  if (value === 0 || value === null || value === undefined) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(1)}K`;
  }

  const decimals = absValue < 1 ? maxDigits : Math.max(0, maxDigits - Math.floor(absValue).toString().length);
  return `${sign}${absValue.toFixed(decimals)}`;
};

export const formatCompactNumber = (value) => {
  if (value === 0 || value === null || value === undefined) {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';

  return formatSignificantDigits(num);
};

export const formatCurrency = (value, currency = 'PKR') => {
  const formatted = formatSignificantDigits(value);
  return `${currency} ${formatted}`;
};


