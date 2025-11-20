import mongoose, { Schema } from "mongoose";
import type {
	LinkType,
	ProfileSchemaType,
	UserResumeType,
} from "../types/schema";

const ResumeSchema = new Schema<UserResumeType>({
	url: { type: String, required: true },
	fileName: { type: String, required: true },
	uploadedAt: { type: Date, default: Date.now },
});

export const LinkSchema = new Schema<LinkType>({
	name: { type: String, required: true },
	url: { type: String, required: true },
	order: { type: Number, default: 0 },
});

const ProfileSchema = new Schema<ProfileSchemaType>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		fullName: { type: String, required: true },
		imageUrl: { type: String, default: "no image" },
		headline: String,
		about: String,
		industry: String,
		contactEmail: String,
		contactPhone: String,
		link: [LinkSchema],
		resume: [ResumeSchema],
	},
	{ timestamps: true },
);

ProfileSchema.pre<ProfileSchemaType>("save", function (next) {
	if (!this.imageUrl || this.imageUrl.trim() === "") {
		this.imageUrl = "no image";
	}
	next();
});

const Profile = mongoose.model<ProfileSchemaType>("Profile", ProfileSchema);

export default Profile;
