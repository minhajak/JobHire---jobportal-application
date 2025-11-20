export type ApiLoginResponse = {
  accessToken: string;
  user: any;
};
export type ApiVerifyOpt = {
  encryptedOTP: string;
};

export type ForgotPasswordResponse = {
  code?: string;
  message?: string;
  link?: string;
  resetToken?: string;
};
export type ResetPasswordResponse = {
  code?: string;
  message?: string;
};
export type VerifyResetTokenResponse = {
  code?: string;
  message?: string;
  valid?: boolean;
};
