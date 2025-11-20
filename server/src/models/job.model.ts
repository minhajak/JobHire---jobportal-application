// models/job.model.ts
import mongoose, { type Document, Schema } from "mongoose";

export interface JobApplication {
	applicantId: mongoose.Types.ObjectId;
	appliedAt: Date;
	status: "pending" | "reviewed" | "shortlisted" | "rejected";
}

export interface JobDocument {
	filename: string;
	originalName: string;
	mimetype: string;
	size: number;
	path: string;
}

export interface JobType extends Document {
	jobTitle?: string;
	company?: mongoose.Types.ObjectId;
	companyName?: string;
	aboutCompany?: string;
	workplaceType?: "remote" | "hybrid" | "onsite";
	jobLocation?: string;
	jobType?: "full-time" | "part-time" | "contract" | "internship";
	jobDescription?: string;
	requirements?: string;
	documentTitle?: string;
	documentFile?: JobDocument;
	privacyOption: "anyone" | "connections";
	selectedStyle: "ai" | "manual";
	status: "draft" | "published";
	createdBy: mongoose.Types.ObjectId;
	views: number;
	applications: JobApplication[];
	createdAt: Date;
	updatedAt: Date;
}

const jobSchema = new Schema<JobType>(
	{
		jobTitle: { type: String, trim: true },
		company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
		companyName: { type: String, trim: true },
		aboutCompany: { type: String, trim: true },
		workplaceType: { type: String, enum: ["remote", "hybrid", "onsite"] },
		jobLocation: { type: String, trim: true },
		jobType: {
			type: String,
			enum: ["full-time", "part-time", "contract", "internship"],
		},
		jobDescription: { type: String },
		requirements: { type: String },
		documentTitle: { type: String, trim: true },
		documentFile: {
			filename: String,
			originalName: String,
			mimetype: String,
			size: Number,
			path: String,
		},
		privacyOption: {
			type: String,
			enum: ["anyone", "connections"],
			default: "anyone",
		},
		selectedStyle: { type: String, enum: ["ai", "manual"], default: "manual" },
		status: { type: String, enum: ["draft", "published"], default: "draft" },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		views: { type: Number, default: 0 },
		applications: [
			{
				applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				appliedAt: { type: Date, default: Date.now },
				status: {
					type: String,
					enum: ["pending", "reviewed", "shortlisted", "rejected"],
					default: "pending",
				},
			},
		],
	},
	{
		timestamps: true,
		toJSON: { virtuals: false },
		toObject: { virtuals: false },
		// Disable Mongoose's automatic id virtual field if you don't need it
		// This prevents potential conflicts
		id: false,
	},
);

// Add compound indexes for better query performance
jobSchema.index({ createdBy: 1, status: 1 });
jobSchema.index({ createdBy: 1, createdAt: -1 });
jobSchema.index({ status: 1, createdAt: -1 });

// Ensure indexes are properly managed
jobSchema.set("autoIndex", process.env.NODE_ENV !== "production");

const Job = mongoose.model<JobType>("Job", jobSchema);

// Function to sync indexes (call this during app startup if needed)
export const syncJobIndexes = async () => {
	try {
		await Job.syncIndexes();
		console.log("Job indexes synchronized successfully");
	} catch (error) {
		console.error("Error synchronizing Job indexes:", error);
	}
};

export default Job;
