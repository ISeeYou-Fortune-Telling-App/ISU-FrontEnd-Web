/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
  SimpleResponse,
  SingleResponse,
  ListResponse,
  ValidationErrorResponse,
} from '@/types/response.type';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !originalRequest._retry
    ) {
      if (window.location.pathname === '/auth/login') {
        return Promise.reject(error);
      }

      const refreshToken =
        localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_GATEWAY_API_URL}/core/auth/refresh`,
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          },
        );

        const { token, refreshToken: newRefreshToken } = res.data;

        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('accessToken', token);
        storage.setItem('refreshToken', newRefreshToken);

        isRefreshing = false;
        onRefreshed(token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export const apiFetch = async <
  T extends SingleResponse<any> | ListResponse<any> | SimpleResponse | ValidationErrorResponse,
>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const finalUrl =
    url.startsWith('/core') || url.startsWith('/notification') || url.startsWith('/report')
      ? url
      : `/core${url}`;

  try {
    const response = await api(finalUrl, config);
    const data = response.data;

    if (data && typeof data === 'object' && 'statusCode' in data) {
      return data as T;
    }

    return {
      statusCode: response.status || 200,
      message: 'Success',
      data,
    } as T;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>;
      const statusCode = axiosErr.response?.status || axiosErr.response?.data?.statusCode || 500;
      const message =
        axiosErr.response?.data?.message ||
        axiosErr.response?.statusText ||
        'Lỗi không xác định từ máy chủ.';

      const validationItems = axiosErr.response?.data?.items;
      if (validationItems) {
        throw { statusCode, message, items: validationItems } as ValidationErrorResponse;
      }

      throw { statusCode, message } as SimpleResponse;
    }

    throw { statusCode: 500, message: 'Lỗi không xác định.' } as SimpleResponse;
  }
};
