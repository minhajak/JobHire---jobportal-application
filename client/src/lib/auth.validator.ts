import { z } from "zod";

// Common helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema for requesting OTP (email only)
export const requestOtpSchema = z.object({
  emailOrPhone: z
    .string()
    .trim()
    .min(1, "Email or phone is required")
    .refine((value) => emailRegex.test(value), {
      message: "Enter a valid email address",
    }),
});


export const verifyOtpSchema = requestOtpSchema.extend({
  otp: z.string().optional(),
});


export const passwordSchema = z
  .string()
  .min(8, {
    message:
      "Password must be at least 8 characters and include uppercase, lowercase, number and special character.",
  })
  .refine(
    (val) =>
      /[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(val),
    {
      message:
        "Password must include uppercase, lowercase, number and special character.",
    }
  );

export const SignUpSchema = requestOtpSchema
  .extend({
    password: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.password === data.newPassword, {
    message: "Passwords do not match",
    path: ["newPassword"],
  });
