import { z } from "zod";

export const employeeSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid employee ID format."),

  position: z
    .string()
    .min(2, "Position must be at least 2 characters long.")
    .max(100, "Position can't be longer than 100 characters."),

  department: z
    .string()
    .min(2, "Department name must be at least 2 characters.")
    .max(100, "Department name can't be longer than 100 characters.")
    .optional(),

  startDate: z.coerce
    .date({
      errorMap: () => ({ message: "Start date must be a valid date." }),
    })
    .optional(),

  endDate: z.coerce
    .date({
      errorMap: () => ({ message: "End date must be a valid date." }),
    })
    .optional(),

  isVerified: z.boolean().optional(),

  isCurrent: z.boolean().optional(),
});
