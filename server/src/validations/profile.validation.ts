import mongoose from "mongoose";
import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string({ required_error: "Please enter your full name." })
    .min(1, "Please enter your full name."),

  contactPhone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Please enter a valid phone number.")
    .optional(),

  about: z
    .string()
    .max(500, "The 'About' section must not be longer than 500 characters.")
    .optional(),
  contactEmail: z
    .string()
    .email("Please enter a valid email address (e.g., user@example.com).")
    .optional(),
});

export const educationSchema = z
  .object({
    school: z
      .string({ required_error: "School is required." })
      .min(1, "School is required.")
      .max(100, "School name must be under 100 characters."),

    degree: z
      .string({ required_error: "Degree is required." })
      .min(1, "Degree is required.")
      .max(100, "Degree must be under 100 characters."),

    fieldOfStudy: z
      .string()
      .max(100, "Field of study must be under 100 characters.")
      .optional(),

    grade: z.string().max(50, "Grade must be under 50 characters.").optional(),

    description: z
      .string()
      .max(1000, "Description must be under 1000 characters.")
      .optional(),

    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date",
    }),

    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date",
      })
      .optional(),
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "Start date cannot be after end date",
      path: ["startDate"],
    }
  );

export const experienceSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required." })
      .min(1, "Title is required.")
      .max(100, "Job title must be under 100 characters."),

    company: z
      .string({ required_error: "Company is required." })
      .min(1, "Company is required.")
      .max(100, "Company name must be under 100 characters."),

    companyId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid company ID",
      })
      .optional(),

    location: z
      .string()
      .max(100, "Location must be under 100 characters.")
      .optional(),

    locationType: z
      .enum(["onsite", "remote", "hybrid"], {
        errorMap: () => ({
          message: "Location type must be one of: onsite, remote, or hybrid",
        }),
      })
      .optional(),

    description: z
      .string()
      .max(1000, "Description must be under 1000 characters.")
      .optional(),

    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Start date must be a valid date",
    }),

    endDate: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "End date must be a valid date",
      })
      .optional(),

    currentlyWorking: z.boolean().optional(),
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate) <= new Date(data.endDate),
    {
      message: "Start date cannot be after end date",
      path: ["startDate"],
    }
  )
  .refine((data) => !(data.currentlyWorking === true && data.endDate), {
    message: "End date should be empty if you're currently working here",
    path: ["endDate"],
  });

export const linkSchema = z.object({
  name: z
    .string()
    .min(2, "Link name must be at least 2 characters.")
    .max(50, "Link name can't be longer than 50 characters."),

  url: z
    .string()
    .url("Please enter a valid URL (including http:// or https://).")
    .max(200, "URL can't be longer than 200 characters."),

  order: z
    .number()
    .int("Order must be a whole number.")
    .min(0, "Order must be 0 or greater.")
    .max(20, "Order can't be greater than 100.")
    .optional(),
});
