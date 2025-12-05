/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
  SimpleResponse,
  SingleResponse,
  ListResponse,
  ValidationErrorResponse,
} from '@/types/response.type';

// Debug env variable
console.log('🔍 NEXT_PUBLIC_GATEWAY_DEPLOY:', process.env.NEXT_PUBLIC_GATEWAY_DEPLOY);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_API_URL + '/core',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Thêm accessToken vào mỗi request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Lấy token từ localStorage hoặc sessionStorage
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Nếu là FormData thì xóa Content-Type (để axios tự set)
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Cờ tránh lặp vô hạn
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Interceptor xử lý refresh token tự động
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      !originalRequest._retry
    ) {
      // Nếu đang ở trang login thì không redirect, throw error để login page xử lý
      if (window.location.pathname === '/auth/login') {
        return Promise.reject(error);
      }

      // Lấy refresh token từ localStorage hoặc sessionStorage
      const refreshToken =
        localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      // Ngăn gọi refresh song song
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

        // Lưu vào storage tương ứng với rememberMe
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
        // Clear cả localStorage và sessionStorage
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

// API wrapper
export const apiFetch = async <
  T extends SingleResponse<any> | ListResponse<any> | SimpleResponse | ValidationErrorResponse,
>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await api(url, config);
    const data = response.data;

    // Nếu trả về chuẩn định dạng
    if (data && typeof data === 'object' && 'statusCode' in data) {
      return data as T;
    }

    // Nếu backend trả data trần
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
