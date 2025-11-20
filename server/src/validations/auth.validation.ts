import xss from "xss";

import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, {
    message:
      "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
  })
  .refine(
    (val) =>
      /[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /[0-9]/.test(val) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(val),
    {
      message:
        "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).",
    }
  );

export const emailSchema = z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
  message: "Email must be a valid format (e.g., user@example.com).",
});

export const phoneSchema = z.string().refine(
  (val) => {
    const digitsOnly = val.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  },
  {
    message:
      "Phone number must be a string of 7 to 15 digits (optional + at start).",
  }
);

export const emailOrPhone = (param: string | undefined) => {
  let email;
  let phone;

  param = xss(param?.toString()?.trim() as string);

  if (param?.includes("@")) {
    email = param;
  } else {
    phone = param;
  }
  return {
    phone,
    email,
  };
};
