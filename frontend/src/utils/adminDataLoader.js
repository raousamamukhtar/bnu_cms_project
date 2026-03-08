import { apiClient } from '../services/api';

/**
 * Load all admin entries from Backend API
 * @returns {Promise<Array>} Array of entries in monthlyAdminData format
 */
export const loadAdminDataFromStorage = async () => {
  try {
    const response = await apiClient.get('/api/reports/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error loading admin data from API:', error);
    return [];
  }
};

