import type {
  ApiLoginResponse,
  ApiVerifyOpt,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyResetTokenResponse,
} from "../types/authType";
import client from "./axios";

export const refresh = async () =>
  client.post<{
    accessToken: string;
  }>(`/auth/refresh`);

export const login = async (emailOrPhone: string, password: string) =>
  client.post<ApiLoginResponse>("/auth/sign-in", { emailOrPhone, password });

export const requestOtp = async (emailOrPhone: string) =>
  client.post("/auth/request-otp", {
    emailOrPhone,
  });

export const verifyOpt = async (emailOrPhone: string, otp: string) =>
  client.post<ApiVerifyOpt>("/auth/verify-otp", {
    emailOrPhone,
    otp,
  });

export const signUp = async (
  emailOrPhone: string,
  password: string,
  encryptedOTP: string,
  username?: string
) => {
  return client.post<ApiLoginResponse>("/auth/sign-up", {
    emailOrPhone,
    password,
    encryptedOTP,
    ...(username ? { username } : {}),
  });
};

export const signout = async () => client.post("/auth/logout");

export const forgotPassword = async (email: string) =>
  client.post<ForgotPasswordResponse>("/reset/forgot-password-otp", { email });

export const verifyForgotPasswordOTP = async (email: string, otp: string) =>
  client.post<ApiVerifyOpt>("/reset/verify-forgot-password-otp", {
    email,
    otp,
  });

export const resetForgottenPassword = async (
  email: string,
  newPassword: string,
  encryptedOTP: string
) =>
  client.put<ResetPasswordResponse>("/reset/reset-forgotten-password", {
    email,
    newPassword,
    encryptedOTP,
  });

export const verifyResetToken = async (token: string) =>
  client.post<VerifyResetTokenResponse>("/auth/verify-email-reset-token", {
    token,
  });

export const resetPassword = async (token: string, password: string) =>
  client.put<ResetPasswordResponse>("/auth/reset-password", {
    token,
    password,
  });
