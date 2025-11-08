import { apiFetch } from '../api';
import { SingleResponse, SimpleResponse, ValidationErrorResponse } from '../../types/response.type';
import { LoginRequest, LoginResponse } from '../../types/auth/auth.type';

const setAuthData = (data: LoginResponse) => {
  if (data.role !== 'ADMIN') throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');

  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('userRole', data.role);
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await apiFetch<SingleResponse<LoginResponse>>('/auth/login', {
    method: 'POST',
    data,
  });

  const loginData = res.data;
  setAuthData(loginData);
  return loginData;
};

export const logout = () => {
  ['accessToken', 'refreshToken', 'userId', 'userRole'].forEach((k) => localStorage.removeItem(k));
  if (typeof window !== 'undefined') window.location.href = '/auth/login';
};
