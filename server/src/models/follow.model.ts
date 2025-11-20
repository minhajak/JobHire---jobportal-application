import mongoose, { type Document, Schema } from "mongoose";

export interface IFollowing extends Document {
	followerId: mongoose.Types.ObjectId;
	followingId: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const FollowSchema: Schema = new Schema(
	{
		followerId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		followingId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Create compound index to prevent duplicate follows and improve query performance
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follow = mongoose.model<IFollowing>("Follow", FollowSchema);
