// src/types/auth.ts
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface PasswordResetData {
  password: string;
  confirmPassword: string;
}

export interface OTPData {
  otp: string[];
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}