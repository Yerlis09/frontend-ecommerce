import axios from 'axios';
import { API_URL } from '../config/api.config';
import type { ApiError } from '../shared/types/api.types';

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = error.response?.data ?? {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? '',
      method: error.config?.method?.toUpperCase() ?? '',
      message: error.message,
    };
    return Promise.reject(apiError);
  }
);

export default httpClient;
