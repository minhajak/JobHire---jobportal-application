import { model, Schema } from "mongoose";
import { groupRequestStatus, type IGroupRequest } from "../types/group.type";

const GroupRequestSchema = new Schema<IGroupRequest>(
	{
		requester: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		group: {
			type: Schema.Types.ObjectId,
			ref: "Group",
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: Object.values(groupRequestStatus),
			default: groupRequestStatus.PENDING,
			index: true,
		},
		requestedAt: { type: Date, default: Date.now, index: true },
		acceptedAt: { type: Date },
	},
	{ timestamps: true }, // optional: adds createdAt & updatedAt
);

// Prevent the same user from requesting the same group multiple times
GroupRequestSchema.index({ requester: 1, group: 1 }, { unique: true });

export default model<IGroupRequest>("GroupRequest", GroupRequestSchema);
