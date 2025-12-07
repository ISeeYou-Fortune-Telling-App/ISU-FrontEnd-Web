import { apiFetch } from '../api-client';
import { SingleResponse } from '@/types/response.type';
import { LoginRequest, LoginResponse } from '@/types/auth/auth.type';

const AUTH_KEYS = ['accessToken', 'refreshToken', 'userId', 'userRole'] as const;

const AuthStorage = {
  set: (data: LoginResponse, rememberMe: boolean = false) => {
    if (data.role !== 'ADMIN') throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');

    // Chọn storage dựa trên rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('accessToken', data.token);
    storage.setItem('refreshToken', data.refreshToken);
    storage.setItem('userId', data.userId);
    storage.setItem('userRole', data.role);

    // Lưu flag rememberMe để biết storage nào đang dùng
    localStorage.setItem('rememberMe', rememberMe.toString());
  },

  clear: () => {
    // Clear cả localStorage và sessionStorage
    AUTH_KEYS.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    localStorage.removeItem('rememberMe');
  },

  getToken: (): string | null => {
    // Thử lấy từ localStorage trước, sau đó sessionStorage
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  },
};

export const AuthService = {
  login: async (payload: LoginRequest, rememberMe: boolean = false): Promise<LoginResponse> => {
    const response = await apiFetch<SingleResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      data: payload,
    });

    const data = response.data;
    AuthStorage.set(data, rememberMe);
    return data;
  },

  logout: () => {
    AuthStorage.clear();
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
  },

  getToken: () => AuthStorage.getToken(),
  getRefreshToken: () => AuthStorage.getRefreshToken(),
};
