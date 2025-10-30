import { apiFetch } from '../api';
import {
  ForgotPasswordRequest,
  ResetPasswordVerifyRequest,
  ResendOTPRequest,
} from '../../types/auth/forgot-password.type';

import { SimpleResponse, ValidationErrorResponse } from '../../types/response.type';

export const requestPasswordReset = async (
  data: ForgotPasswordRequest,
): Promise<SimpleResponse | ValidationErrorResponse> => {
  const response = await apiFetch<SimpleResponse | ValidationErrorResponse>(
    '/auth/forgot-password',
    {
      method: 'POST',
      data,
    },
  );
  return response;
};

export const resendOTP = async (
  data: ResendOTPRequest,
): Promise<SimpleResponse | ValidationErrorResponse> => {
  const response = await apiFetch<SimpleResponse | ValidationErrorResponse>('/auth/resend-otp', {
    method: 'POST',
    data,
  });
  return response;
};

export const verifyAndResetPassword = async (
  data: ResetPasswordVerifyRequest,
): Promise<SimpleResponse | ValidationErrorResponse> => {
  const response = await apiFetch<SimpleResponse | ValidationErrorResponse>(
    '/auth/forgot-password/verify',
    {
      method: 'POST',
      data,
    },
  );
  return response;
};
