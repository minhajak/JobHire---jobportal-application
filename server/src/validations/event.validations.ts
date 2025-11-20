import mongoose from "mongoose";
import z from "zod";

export const eventSchema = z.object({
	eventName: z
		.string()
		.min(2, "event name must be atleast 2 characters")
		.max(100, "event name can't be longer than 100 character"),
	timeZone: z
		.string()
		.min(3, "timezone must be atleast 3 characters")
		.max(50, "timezone can't be longer than 50 character"),
	eventType: z
		.string()
		.min(2, "Industry name must be at least 2 characters.")
		.max(50, "Industry name can't exceed 50 characters."),
	startDateTime: z.coerce.date({
		errorMap: () => ({ message: "Start date must be a valid date." }),
	}),
	endDateTime: z.coerce
		.date({
			errorMap: () => ({ message: "Start date must be a valid date." }),
		})
		.optional(),
	externalLink: z.string().url().optional(),
	description: z
		.string()
		.min(5, "description must be atleast 5 characters")
		.max(200, "description can't be longer than 200 character"),
	speakersId: z
		.array(z.string())
		.optional()
		.transform((ids) =>
			(ids ?? []).map((id) => new mongoose.Types.ObjectId(id)),
		),
});
