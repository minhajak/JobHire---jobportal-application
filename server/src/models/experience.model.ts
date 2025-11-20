import mongoose, { Schema } from "mongoose";
import type { ExperienceType } from "../types/schema";

const ExperienceSchema = new Schema<ExperienceType>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	title: { type: String, required: true },
	company: { type: String, required: true },
	companyId: {
		type: Schema.Types.ObjectId,
		ref: "Company",
	},
	location: { type: String },
	locationType: {
		type: String,
		enum: ["onsite", "remote", "hybrid"],
		default: "onsite",
	},
	startDate: { type: Date, required: true },
	endDate: { type: Date },
	currentlyWorking: { type: Boolean, default: false },
	description: { type: String },
});

const Experience = mongoose.model<ExperienceType>(
	"Experience",
	ExperienceSchema,
);

export default Experience;
