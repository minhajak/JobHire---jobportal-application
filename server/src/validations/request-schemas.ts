import { z } from "zod";
import { emailSchema, passwordSchema } from "./auth.validation";

const emailSchemaWrapper = z.object({
  emailOrPhone: emailSchema,
});

export const SignInRequestSchema = emailSchemaWrapper.extend({
  password: z.string().min(1, "Password is required"),
});

export const RequestOtpSchema = emailSchemaWrapper;

export const VerifyOtpSchema = emailSchemaWrapper.extend({
  // Per requirement: no OTP format validation; accept optional string
  otp: z.string().optional(),
});

export const SignUpRequestSchema = emailSchemaWrapper.extend({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[A-Za-z0-9_.-]+$/,
      "Only letters, numbers, underscore, dot, and hyphen allowed"
    ),
  password: passwordSchema,
  encryptedOTP: z.string().min(1, "Please verify the OTP."),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type RequestOtp = z.infer<typeof RequestOtpSchema>;
export type VerifyOtp = z.infer<typeof VerifyOtpSchema>;
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
