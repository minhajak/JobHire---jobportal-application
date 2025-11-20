import z from "zod";
import { OrganisationSize, OrganisationType } from "../types/page.type";

export const pageSchema = z.object({
  name: z
    .string()
    .min(2, "atleast have 2 chracter")
    .max(50, "page name is too long"),
  website: z.string().min(5, "is too small").max(50, "link is too large"),
  industry: z
    .string()
    .min(2, "industry should be atleast 2 character long")
    .max(50, "industry field is too long"),
  organisationSize: z.nativeEnum(OrganisationSize, {
    errorMap: () => ({ message: "Invalid organisation size" }),
  }),
  organisationType: z.nativeEnum(OrganisationType, {
    errorMap: () => ({ message: "Invalid organisation type" }),
  }),
  logo: z.string().url("Invalid logo URL"),
  tagline: z
    .string()
    .min(10, "Tagline should be at least 10 characters")
    .max(200, "Tagline is too long"),
});
