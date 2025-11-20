// validations/job.validation.ts
import { z } from "zod";

export const publishJobSchema = z.object({
	jobTitle: z
		.string()
		.min(1, "Job title is required")
		.max(200, "Job title too long"),
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(100, "Company name too long"),
	aboutCompany: z.string().optional(),
	workplaceType: z.enum(["remote", "hybrid", "onsite"]),
	jobLocation: z.string().min(1, "Job location is required"),
	jobType: z.enum(["full-time", "part-time", "contract", "internship"]),
	jobDescription: z.string().min(1, "Job description is required"),
	requirements: z.string().optional(),
	documentTitle: z.string().optional(),
	privacyOption: z.enum(["anyone", "connections"]).default("anyone"),
	selectedStyle: z.enum(["ai", "manual"]).default("manual"),
	status: z.enum(["draft", "published"]).optional(),
});

export const draftJobSchema = z.object({
	jobTitle: z.string().optional(),
	companyName: z.string().optional(),
	aboutCompany: z.string().optional(),
	workplaceType: z.enum(["remote", "hybrid", "onsite"]).optional(),
	jobLocation: z.string().optional(),
	jobType: z
		.enum(["full-time", "part-time", "contract", "internship"])
		.optional(),
	jobDescription: z.string().optional(),
	requirements: z.string().optional(),
	documentTitle: z.string().optional(),
	privacyOption: z.enum(["anyone", "connections"]).default("anyone"),
	selectedStyle: z.enum(["ai", "manual"]).default("manual"),
	status: z.enum(["draft", "published"]).optional(),
});

export type PublishJobInput = z.infer<typeof publishJobSchema>;
export type DraftJobInput = z.infer<typeof draftJobSchema>;
