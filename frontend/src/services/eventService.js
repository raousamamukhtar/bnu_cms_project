import { apiClient } from './api';

/**
 * Event API Service
 * Handles all event-related API calls with authentication
 */

/**
 * Get all events for the authenticated user
 */
export const getEvents = async () => {
    try {
        const response = await apiClient.get('/events');
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

/**
 * Create a new event
 */
export const createEvent = async (eventData) => {
    try {
        const response = await apiClient.post('/events', eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

/**
 * Update an existing event
 */
export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await apiClient.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

/**
 * Delete an event
 */
export const deleteEvent = async (eventId) => {
    try {
        const response = await apiClient.delete(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

/**
 * Get month number from month name
 */
export const getMonthNumber = (monthName) => {
    const months = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || 1;
};

/**
 * Get month name from month number
 */
export const getMonthName = (monthNumber) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || 'January';
};
