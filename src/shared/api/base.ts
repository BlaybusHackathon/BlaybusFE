import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from './types';
import { getAuthToken, logoutAndClear } from '@/shared/stores/authStore';
import { isRecord } from './parse';

const baseURL = import.meta.env.VITE_API_URL;

const attachAuth = (config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export const rawClient = axios.create({ baseURL });

export const apiClient = axios.create({ baseURL });
apiClient.interceptors.request.use(attachAuth);
const isApiResponse = (value: unknown): value is ApiResponse<unknown> => {
  if (!isRecord(value)) return false;
  if (!('success' in value) || !('data' in value) || !('error' in value)) return false;
  return typeof value.success === 'boolean';
};

const unwrapResponse = (res: AxiosResponse) => {
  const body = res.data as unknown;

  // Support both wrapped and raw DTO responses.
  if (isApiResponse(body)) {
    if (body.success) return body.data;
    return Promise.reject(
      body.error ?? ({ code: 'UNKNOWN_ERROR', message: 'Unknown error' } as ApiError)
    );
  }

  return body;
};
apiClient.interceptors.response.use(
  (res: AxiosResponse) => unwrapResponse(res) as AxiosResponse,
  (err: AxiosError<unknown>) => {
    const status = err.response?.status;
    if (status === 401) {
      logoutAndClear();
    }
    const data = err.response?.data;

    // CustomException shape: { status, message } or { code, message }
    if (isRecord(data) && ('status' in data || 'message' in data || 'code' in data)) {
      const status = 'status' in data ? data.status : undefined;
      const codeValue = 'code' in data ? data.code : undefined;
      const message = 'message' in data ? data.message : undefined;
      return Promise.reject({
        code: typeof codeValue === 'string'
          ? codeValue
          : String(status ?? err.response?.status ?? 'SERVER_ERROR'),
        message: typeof message === 'string' ? message : 'Server error',
      } as ApiError);
    }

    // Validation errors: { field: "message", ... }
    if (isRecord(data)) {
      const entries = Object.entries(data);
      if (entries.length > 0) {
        const first = entries[0];
        return Promise.reject({
          code: 'VALIDATION_ERROR',
          message: `${first[0]}: ${String(first[1])}`,
        } as ApiError);
      }
    }

    return Promise.reject({
      code: status ? String(status) : 'NETWORK_ERROR',
      message: 'Network error',
    } as ApiError);
  }
);

