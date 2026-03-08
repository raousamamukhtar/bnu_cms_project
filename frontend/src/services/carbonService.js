import { apiClient } from './api';

/**
 * Carbon Service
 * Handles all carbon-related API calls
 */
export const carbonService = {
    /**
     * Get all carbon data entries
     * @returns {Promise<Array>} List of carbon entries
     */
    async getCarbonData() {
        try {
            const response = await apiClient.get('/sustainability/carbon');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch carbon data:', error);
            const message = error.response?.data?.message || 'Failed to load carbon data';
            throw new Error(message);
        }
    },

    /**
     * Create new carbon entry
     * @param {Object} data - Carbon entry data
     * @returns {Promise<Object>} Created carbon entry
     */
    async createCarbonEntry(data) {
        try {
            const response = await apiClient.post('/sustainability/carbon', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create carbon entry:', error);
            const message = error.response?.data?.message || 'Failed to create carbon entry';
            throw new Error(message);
        }
    },

    /**
     * Update existing carbon entry
     * @param {number} id - Entry ID
     * @param {Object} data - Updated data
     * @returns {Promise<Object>} Updated carbon entry
     */
    async updateCarbonEntry(id, data) {
        try {
            const response = await apiClient.put(`/sustainability/carbon/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update carbon entry:', error);
            const message = error.response?.data?.message || 'Failed to update carbon entry';
            throw new Error(message);
        }
    },

    /**
     * Delete carbon entry
     * @param {number} id - Entry ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    async deleteCarbonEntry(id) {
        try {
            const response = await apiClient.delete(`/sustainability/carbon/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to delete carbon entry:', error);
            const message = error.response?.data?.message || 'Failed to delete carbon entry';
            throw new Error(message);
        }
    }
};
