import axios from 'axios';
import { tokenStorage } from '../auth/tokenStorage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  // Debug Console Start
  console.log('[HTTP] ➜', config.method?.toUpperCase());
  if (config.data) console.log('[HTTP] payload:', config.data);
  // Debug Console End

  const token = await tokenStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      await tokenStorage.clearToken();
    }
    return Promise.reject(error);
  }
);
