import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import {
  SimpleResponse,
  SingleResponse,
  ListResponse,
  ValidationErrorResponse,
} from '@/types/response.type';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

//Gắn thêm accessToken vào mỗi request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    //Formdata thì tự xóa Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.location.href = '/auth/login';
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
  try {
    const response = await api(url, config);
    const data = response.data;

    // Nếu trả về đúng định dạng chuẩn
    if (data && typeof data === 'object' && 'statusCode' in data) {
      return data as T;
    }

    // Nếu chỉ trả data trần hoặc object khác → wrap lại
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
        // Trả về ValidationErrorResponse nếu có field cụ thể
        throw {
          statusCode,
          message,
          items: validationItems,
        } as ValidationErrorResponse;
      }

      throw {
        statusCode,
        message,
      } as SimpleResponse;
    }

    throw {
      statusCode: 500,
      message: 'Lỗi không xác định.',
    } as SimpleResponse;
  }
};
