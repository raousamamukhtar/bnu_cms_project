import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add interceptor to add token if needed (Sanctum uses cookies with credentials: true usually sufficient for SPA on same domain or properly configured CORS, 
// but for localhost dev on different ports, we often need to handle CSRF token or Bearer token if using API tokens)
// Since we are using Sanctum, we should first hit /sanctum/csrf-cookie.

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Response Interceptor for expert-level API data handling
apiClient.interceptors.response.use(
    (response) => {
        // If the backend uses our ApiResponser trait (status/message/data wrapper)
        if (response.data && response.data.status && response.data.hasOwnProperty('data')) {
            return {
                ...response,
                data: response.data.data,
                message: response.data.message,
                statusText: response.data.status
            };
        }
        return response;
    },
    (error) => {
        // Handle common errors (401, 500 etc) here if needed
        return Promise.reject(error);
    }
);
