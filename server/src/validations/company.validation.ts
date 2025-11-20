import { z } from "zod";
import { employeeSchema } from "./employee.validation";
import { linkSchema } from "./profile.validation";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters long.")
    .max(100, "Company name can't be longer than 100 characters."),

  industry: z
    .string()
    .min(2, "Industry name must be at least 2 characters.")
    .max(50, "Industry name can't exceed 50 characters.")
    .optional(),

  specialties: z
    .array(
      z
        .string()
        .min(2, "Specialty must be at least 2 characters.")
        .max(50, "Specialty can't exceed 50 characters.")
    )
    .min(0)
    .max(20, "You can list up to 20 specialties only.")
    .optional(),

  estYear: z
    .number()
    .int("Year must be a whole number.")
    .min(1800, "Establishment year must be after 1800.")
    .max(new Date().getFullYear(), "Establishment year can't be in the future.")
    .optional(),

  size: z
    .string()
    .min(2, "Size must be at least 2 characters.")
    .max(30, "Size can't exceed 30 characters.")
    .optional(),

  type: z
    .enum(["Private", "Public", "Non-profit", "Government"], {
      errorMap: () => ({
        message:
          "Type must be one of: Private, Public, Non-profit, or Government.",
      }),
    })
    .optional(),

  about: z
    .string()
    .min(10, "Please provide at least 10 characters in About section.")
    .max(1000, "About section can't exceed 1000 characters.")
    .optional(),

  website: z
    .string()
    .url("Please enter a valid website URL.")
    .max(200, "Website URL can't exceed 200 characters.")
    .optional(),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(100, "Email can't exceed 100 characters.")
    .optional(),

  phone: z
    .string()
    .min(6, "Phone number must be at least 6 digits.")
    .max(20, "Phone number can't exceed 20 digits.")
    .optional(),

  logoUrl: z.string().url("Please provide a valid logo URL.").optional(),

  bannerUrl: z.string().url("Please provide a valid banner URL.").optional(),

  headquarters: z
    .string()
    .min(2, "Headquarters location must be at least 2 characters.")
    .max(100, "Headquarters location can't exceed 100 characters.")
    .optional(),

  locations: z
    .array(
      z
        .string()
        .min(2, "Each location must be at least 2 characters.")
        .max(100, "Each location can't exceed 100 characters.")
    )
    .max(20, "You can list up to 20 locations.")
    .optional(),

  socialLinks: z
    .array(linkSchema)
    .max(10, "You can add up to 10 social links only.")
    .optional(),

  verified: z.boolean().optional(),

  followers: z
    .array(
      z
        .string()
        .regex(/^[a-f\d]{24}$/i, "Each follower ID must be a valid user ID.")
    )
    .max(1000000, "Follower count exceeded limit.")
    .optional(),

  employees: z
    .array(employeeSchema)
    .max(100000, "Employee count exceeded limit.")
    .optional(),
});
