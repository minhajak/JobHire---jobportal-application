import mongoose, { Document, Schema } from "mongoose";
import {
	type Ipage,
	OrganisationSize,
	OrganisationType,
} from "../types/page.type";

const pageSchema = new Schema<Ipage>(
	{
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		website: {
			type: String,
		},
		industry: {
			type: String,
			trim: true,
		},
		organisationSize: {
			type: String,
			required: true,
			enum: Object.values(OrganisationSize),
		},
		organisationType: {
			type: String,
			required: true,
			enum: Object.values(OrganisationType),
		},
		logo: {
			type: String,
		},
		tagline: {
			type: String,
			required: true,
			trim: true,
		},
		followers: {
			type: [String],
			default: [],
		},
		followerCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Index for faster queries
pageSchema.index({ creatorId: 1 });
pageSchema.index({ link: 1 });

const Page = mongoose.model<Ipage>("Page", pageSchema);

export default Page;
