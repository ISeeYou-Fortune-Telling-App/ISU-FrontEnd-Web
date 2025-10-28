import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    // 🔸 Kiểm tra môi trường: chỉ chạy ở client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('🔑 Token attached?', !!token, config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================================
// 🚨 RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiFetch = async <T>(
  url: string,
  config?: any
): Promise<T> => {
  try {
    const response = await api(url, config);
    return response.data;
  } catch (error: any) {
    console.error('API error:', error.response?.data || error.message);
    throw error;
  }
};

// ----- Wrapper chung của BE -----
export interface SingleResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
