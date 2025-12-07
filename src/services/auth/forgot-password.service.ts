import { apiFetch } from '../api-client';
import { SimpleResponse, ValidationErrorResponse } from '../../types/response.type';
import {
  ForgotPasswordRequest,
  ResetPasswordVerifyRequest,
  ResendOTPRequest,
} from '../../types/auth/forgot-password.type';

export const requestPasswordReset = (data: ForgotPasswordRequest) =>
  apiFetch<SimpleResponse | ValidationErrorResponse>('/auth/forgot-password', {
    method: 'POST',
    data,
  });

export const resendOTP = (data: ResendOTPRequest) =>
  apiFetch<SimpleResponse | ValidationErrorResponse>('/auth/resend-otp', {
    method: 'POST',
    data,
  });

export const verifyAndResetPassword = (data: ResetPasswordVerifyRequest) =>
  apiFetch<SimpleResponse | ValidationErrorResponse>('/auth/forgot-password/verify', {
    method: 'POST',
    data,
  });
