import { apiFetch } from '@/lib/api'; 

interface ForgotPasswordRequestPayload {
  email: string;
}

interface ResetPasswordVerifyPayload {
  email: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
}

interface Response {
  statusCode: 200;
  message: string; 
}

export const requestPasswordReset = (data: ForgotPasswordRequestPayload): Promise<Response> => {
  return apiFetch<Response>('/auth/forgot-password', {
    method: 'POST',
    body: data,
  });
};

export const verifyAndResetPassword = (data: ResetPasswordVerifyPayload): Promise<Response> => {
  return apiFetch<Response>('/auth/forgot-password/verify', {
    method: 'POST',
    body: data,
  });
};