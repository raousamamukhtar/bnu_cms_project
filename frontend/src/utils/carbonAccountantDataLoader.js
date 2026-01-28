/**
 * Load all carbon accountant entries from localStorage
 * @returns {Array} Array of entries with month, year, aqi, and carbonFootprint
 */
export const loadCarbonAccountantDataFromStorage = () => {
  const entries = [];
  const processed = new Set();
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthAbbr = {
    'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
    'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
    'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
  };

  // Scan localStorage for all carbon accountant entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('carbon_accountant_data_')) {
      const parts = key.replace('carbon_accountant_data_', '').split('_');
      if (parts.length === 2) {
        const year = parts[0];
        const month = parts[1];
        const entryKey = `${year}_${month}`;
        
        // Avoid duplicates
        if (!processed.has(entryKey)) {
          processed.add(entryKey);
          
          try {
            const entryData = localStorage.getItem(key);
            if (entryData) {
              const data = JSON.parse(entryData);
              if (data.aqi !== undefined && data.carbonFootprint !== undefined) {
                entries.push({
                  year,
                  month,
                  monthAbbr: monthAbbr[month] || month.substring(0, 3),
                  aqi: parseFloat(data.aqi) || 0,
                  carbonFootprint: parseFloat(data.carbonFootprint) || 0,
                  // For AQI chart, we'll use default PM values if not provided
                  pm25: data.pm25 || 0,
                  pm10: data.pm10 || 0,
                });
              }
            }
          } catch (e) {
            console.error('Error parsing carbon accountant entry:', e);
          }
        }
      }
    }
  }
  
  // Sort by year (descending) then by month
  entries.sort((a, b) => {
    if (b.year !== a.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });
  
  return entries;
};

