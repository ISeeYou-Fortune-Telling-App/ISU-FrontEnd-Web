import { apiFetch } from '../api'; 

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
  statusCode: number;
  message: string;
}

export const requestPasswordReset = async (
  data: ForgotPasswordRequestPayload
): Promise<Response> => {
  const response = await apiFetch<Response>('/auth/forgot-password', {
    method: 'POST',
    data,
  });
  return response;
};

export const verifyAndResetPassword = async (
  data: ResetPasswordVerifyPayload
): Promise<Response> => {
  const response = await apiFetch<Response>('/auth/forgot-password/verify', {
    method: 'POST',
    data,
  });
  return response;
};
