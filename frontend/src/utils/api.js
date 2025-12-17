import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://sdms.fake/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pingServer = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};


