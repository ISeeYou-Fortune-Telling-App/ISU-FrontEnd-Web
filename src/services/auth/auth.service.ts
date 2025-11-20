import { apiFetch } from '../api-core';
import { SingleResponse } from '@/types/response.type';
import { LoginRequest, LoginResponse } from '@/types/auth/auth.type';

const AUTH_KEYS = ['accessToken', 'refreshToken', 'userId', 'userRole'] as const;

const AuthStorage = {
  set: (data: LoginResponse) => {
    if (data.role !== 'ADMIN') throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');

    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userRole', data.role);
  },

  clear: () => {
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  },
};

export const AuthService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiFetch<SingleResponse<LoginResponse>>('/auth/login', {
      method: 'POST',
      data: payload,
    });

    const data = response.data;
    AuthStorage.set(data);
    return data;
  },

  logout: () => {
    AuthStorage.clear();
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
  },
};
