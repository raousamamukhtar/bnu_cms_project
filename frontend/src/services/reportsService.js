import { apiClient } from './api';

/**
 * Reports Service
 * Handles all report and dashboard data API calls
 */
export const reportsService = {
    /**
     * Get dashboard data for management
     * @returns {Promise<Object>} Dashboard metrics and analytics
     */
    async getDashboardData() {
        try {
            const response = await apiClient.get('/reports/dashboard');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            const message = error.response?.data?.message || 'Failed to load dashboard data';
            throw new Error(message);
        }
    },

    /**
     * Export report in specified format
     * @param {string} format - Export format (pdf, excel, csv)
     * @param {Object} filters - Report filters
     * @returns {Promise<Blob>} Report file
     */
    async exportReport(format = 'pdf', filters = {}) {
        try {
            const response = await apiClient.post('/reports/export', {
                format,
                filters
            }, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Failed to export report:', error);
            const message = error.response?.data?.message || 'Failed to export report';
            throw new Error(message);
        }
    },

    /**
     * Get analytics data with parameters
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Analytics data
     */
    async getAnalytics(params = {}) {
        try {
            const response = await apiClient.get('/reports/analytics', { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            const message = error.response?.data?.message || 'Failed to load analytics';
            throw new Error(message);
        }
    }
};
