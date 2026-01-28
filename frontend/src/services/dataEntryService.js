/**
 * Data Entry Service
 * 
 * This service abstracts data storage operations for the admin data entry form.
 * Currently uses localStorage, but can be easily replaced with API calls when database is ready.
 * 
 * MIGRATION GUIDE (when ready to use DB):
 * ========================================
 * 
 * 1. Import apiClient:
 *    import { apiClient } from '../utils/api';
 * 
 * 2. Update each function to return Promises and use API calls:
 *    Example:
 *    export const loadStepData = async (year, month) => {
 *      const response = await apiClient.get(`/api/admin/data-entry/${year}/${month}`);
 *      return response.data;
 *    };
 * 
 * 3. Update component to handle async operations:
 *    In DataEntry.jsx, wrap service calls in async/await or use .then()
 * 
 * 4. Error handling:
 *    Add try/catch blocks and proper error handling in service functions
 * 
 * 5. The component (DataEntry.jsx) should remain mostly unchanged as it uses the same interface
 * 
 * API ENDPOINTS EXPECTED:
 * - GET  /api/admin/data-entry/:year/:month              - Get all step data
 * - POST /api/admin/data-entry/:year/:month/step/:stepId - Save step data
 * - GET  /api/admin/data-entry/:year/:month/status       - Get submission status
 * - PATCH /api/admin/data-entry/:year/:month/step/:stepId/status - Update step status
 * - GET  /api/admin/data-entry/:year/:month/completion-status - Check if all completed
 */

/**
 * Load step data for a specific month/year
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @returns {Object|null} Step data object or null if not found
 */
export const loadStepData = (year, month) => {
  // TODO: When DB is ready, replace with:
  // return apiClient.get(`/api/admin/data-entry/${year}/${month}`).then(res => res.data);
  
  const key = `admin_data_${year}_${month}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Save step data for a specific month/year
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @param {Object} stepData - Data for the step
 * @param {number} stepId - Step ID (1-7)
 * @returns {void}
 */
export const saveStepData = (year, month, stepData, stepId) => {
  // TODO: When DB is ready, replace with:
  // return apiClient.post(`/api/admin/data-entry/${year}/${month}/step/${stepId}`, stepData);
  
  const key = `admin_data_${year}_${month}`;
  const existing = loadStepData(year, month) || {};
  const updated = { ...existing, [`step${stepId}`]: stepData };
  localStorage.setItem(key, JSON.stringify(updated));
};

/**
 * Load submission status for all steps for a specific month/year
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @returns {Object} Object with step IDs as keys and boolean submission status as values
 */
export const loadSubmissionStatus = (year, month) => {
  // TODO: When DB is ready, replace with:
  // return apiClient.get(`/api/admin/data-entry/${year}/${month}/status`).then(res => res.data);
  
  const key = `admin_status_${year}_${month}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
};

/**
 * Save submission status for a step
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @param {number} stepId - Step ID (1-7)
 * @param {boolean} submitted - Whether the step is submitted
 * @returns {void}
 */
export const saveSubmissionStatus = (year, month, stepId, submitted) => {
  // TODO: When DB is ready, replace with:
  // return apiClient.patch(`/api/admin/data-entry/${year}/${month}/step/${stepId}/status`, { submitted });
  
  const key = `admin_status_${year}_${month}`;
  const existing = loadSubmissionStatus(year, month);
  const updated = { ...existing, [stepId]: submitted };
  localStorage.setItem(key, JSON.stringify(updated));
};

/**
 * Check if all steps are completed for a specific month/year
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @param {number} totalSteps - Total number of steps (default: 7)
 * @returns {boolean} True if all steps are completed
 */
export const areAllStepsCompleted = (year, month, totalSteps = 7) => {
  // TODO: When DB is ready, replace with:
  // return apiClient.get(`/api/admin/data-entry/${year}/${month}/completion-status`)
  //   .then(res => res.data.allCompleted);
  
  const status = loadSubmissionStatus(year, month);
  for (let i = 1; i <= totalSteps; i++) {
    if (!status[i]) return false;
  }
  return true;
};

/**
 * Submit a complete data entry for a month/year (for future use)
 * @param {string} year - Year (e.g., "2024")
 * @param {string} month - Month (e.g., "January")
 * @param {Object} completeData - Complete data object for all steps
 * @returns {Promise<Object>} Server response
 */
export const submitCompleteEntry = async (year, month, completeData) => {
  // TODO: When DB is ready, implement:
  // return apiClient.post(`/api/admin/data-entry/${year}/${month}/submit`, completeData);
  
  // Save submission timestamp
  saveSubmissionTimestamp(year, month);
  
  // For now, just log and return success
  console.log('Complete entry submission:', { year, month, completeData });
  return Promise.resolve({ success: true, message: 'Data saved to localStorage' });
};

/**
 * Get all submitted months/years (for future use)
 * @returns {Promise<Array>} Array of {year, month} objects
 */
export const getSubmittedPeriods = async () => {
  // TODO: When DB is ready, replace with:
  // return apiClient.get('/api/admin/data-entry/submitted-periods').then(res => res.data);
  
  // For now, scan localStorage keys
  const periods = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('admin_status_')) {
      const parts = key.replace('admin_status_', '').split('_');
      if (parts.length === 2) {
        periods.push({ year: parts[0], month: parts[1] });
      }
    }
  }
  return Promise.resolve(periods);
};

/**
 * Get all submitted entries with their complete data
 * @returns {Promise<Array>} Array of entry objects with year, month, and all data
 */
export const getAllSubmittedEntries = async () => {
  // TODO: When DB is ready, replace with:
  // return apiClient.get('/api/admin/data-entry/all').then(res => res.data);
  
  const entries = [];
  const processed = new Set();
  
  // Scan localStorage for all admin entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('admin_status_')) {
      const parts = key.replace('admin_status_', '').split('_');
      if (parts.length === 2) {
        const year = parts[0];
        const month = parts[1];
        const entryKey = `${year}_${month}`;
        
        // Avoid duplicates
        if (!processed.has(entryKey)) {
          processed.add(entryKey);
          
          // Check if all steps are completed
          const status = loadSubmissionStatus(year, month);
          const allCompleted = Object.values(status).every(Boolean) && Object.keys(status).length >= 7;
          
          if (allCompleted) {
            // Load the complete data
            const stepData = loadStepData(year, month);
            if (stepData) {
              entries.push({
                year,
                month,
                status,
                data: stepData,
                submittedAt: localStorage.getItem(`admin_submittedAt_${year}_${month}`) || null,
              });
            }
          }
        }
      }
    }
  }
  
  // Sort by year (descending) then by month
  entries.sort((a, b) => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (b.year !== a.year) {
      return parseInt(b.year) - parseInt(a.year);
    }
    return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
  });
  
  return Promise.resolve(entries);
};

/**
 * Save submission timestamp
 * @param {string} year - Year
 * @param {string} month - Month
 * @returns {void}
 */
export const saveSubmissionTimestamp = (year, month) => {
  const key = `admin_submittedAt_${year}_${month}`;
  localStorage.setItem(key, new Date().toISOString());
};

