import { apiFetch } from '../api'; 

interface LoginPayload {
  email: string;
  password: string;
}

interface APIResponse<T> {
    statusCode: number;
    message: string;
    data: T; // T là kiểu dữ liệu cụ thể (ở đây là LoginData)
}

interface LoginData {
  token: string;
  refreshToken: string;
  userId: string;
  role: string;
}

const setAuthData = (data: LoginData) => {
  if (data.role !== 'ADMIN') {
    throw new Error('Bạn không có quyền truy cập vào hệ thống Admin.');
  }

  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('userRole', data.role);
};

export const login = async (data: LoginPayload): Promise<LoginData> => {
    console.log("Full Login URL:", process.env.NEXT_PUBLIC_API_URL + '/auth/login');
    
    // 🚨 SỬA LỖI 2: apiFetch giờ đây trả về APIResponse<LoginData>
    const apiResponse = await apiFetch<APIResponse<LoginData>>('/auth/login', { 
        method: 'POST',
        data,
    });

    // Lấy object data thực tế để xử lý
    const loginData = apiResponse.data;

    setAuthData(loginData);
    
    // Trả về loginData (chứ không phải toàn bộ apiResponse)
    return loginData; 
};

export const logout = () => {
  // 🔥 Xóa toàn bộ thông tin xác thực
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');

  // Điều hướng về trang đăng nhập
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

