import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sdms.fake/api';
const IS_DEMO_MODE = !import.meta.env.VITE_API_BASE_URL || API_BASE_URL.includes('fake');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('sdms_auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Ignore parsing errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (IS_DEMO_MODE) {
      return Promise.reject(
        new Error('Demo mode: API server not configured. Using local data only.')
      );
    }
    return Promise.reject(error);
  }
);

export const pingServer = async () => {
  if (IS_DEMO_MODE) {
    return Promise.resolve({ status: 'demo', message: 'Running in demo mode' });
  }

  try {
    const response = await apiClient.get('/health', { timeout: 3000 });
    return response.data || { status: 'online' };
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return { status: 'timeout', message: 'Server request timed out' };
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return { status: 'offline', message: 'Server unreachable' };
    }
    return { status: 'error', message: error.message || 'Unknown error' };
  }
};


