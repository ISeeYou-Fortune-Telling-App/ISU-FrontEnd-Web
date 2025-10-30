export interface ForgotPasswordRequest {
  email: string;
}

export interface ResendOTPRequest {
    email: string;
}

export interface ResetPasswordVerifyRequest {
  email: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
}

