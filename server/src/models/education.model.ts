import mongoose, { Schema } from "mongoose";
import type { EducationType } from "../types/schema";

const EducationSchema = new Schema<EducationType>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

	school: { type: String, required: true },

	degree: { type: String, required: true },

	fieldOfStudy: String,

	startDate: { type: Date, required: true },

	endDate: Date,

	grade: String,

	description: String,
});

const Education = mongoose.model<EducationType>("Education", EducationSchema);

export default Education;
