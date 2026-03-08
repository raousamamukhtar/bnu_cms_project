import { apiClient } from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User data with token
     */
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Failed to authenticate. Please try again.';
            throw new Error(message);
        }
    },

    /**
     * Logout current user
     * @returns {Promise<Object>} Logout confirmation
     */
    async logout() {
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails on server, we should clear local state
            throw new Error('Logout failed');
        }
    },

    /**
     * Verify current authentication token
     * @returns {Promise<Object>} User data if token valid
     */
    async checkAuth() {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Auth check failed:', error);
            throw new Error('Authentication verification failed');
        }
    }
};
