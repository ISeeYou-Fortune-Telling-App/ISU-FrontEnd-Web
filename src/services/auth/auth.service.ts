import { apiFetch } from '../api';
import { SingleResponse, SimpleResponse, ValidationErrorResponse } from '../../types/response.type';
import { LoginRequest, LoginResponse } from '../../types/auth/auth.type';

const setAuthData = (data: LoginResponse) => {
  if (data.role !== 'ADMIN') {
    throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');
  }

  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('userRole', data.role);
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const apiResponse = await apiFetch<
    SingleResponse<LoginResponse> | SimpleResponse | ValidationErrorResponse
  >('/auth/login', {
    method: 'POST',
    data,
  });

  if ('data' in apiResponse) {
    const loginData = apiResponse.data;
    setAuthData(loginData);
    return loginData;
  }

  if ('items' in apiResponse) {
    throw new Error('Validation failed');
  }
  throw new Error(apiResponse.message || 'Đăng nhập thất bại.');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
