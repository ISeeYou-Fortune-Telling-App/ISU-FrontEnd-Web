import { apiFetch } from '@/lib/api'; 

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: string;
  role: string;
}

const setAuthData = (data: LoginResponse) => {

  if (data.role !== 'admin') {
    throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');
  }
  
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('userRole', data.role);
};

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: data,
    });
    setAuthData(response); 
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};





