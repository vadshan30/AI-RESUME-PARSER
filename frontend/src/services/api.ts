import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../utils/env';

const api = axios.create({
  baseURL: env.getApiUrl(),
  timeout: env.getConfig().apiTimeout,
  withCredentials: false,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (env.getConfig().enableDebug) {
      const base = config.baseURL || window.location.origin;
      console.log(`[API] ${config.method?.toUpperCase()} ${base}${config.url}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (env.getConfig().enableDebug) {
      if (!error.response) {
        console.error('[API] No response —', error.code, error.message);
      } else {
        console.error(`[API] HTTP ${error.response.status}`, error.response.data);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
