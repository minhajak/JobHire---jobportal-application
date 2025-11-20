import mongoose, {
	type Document,
	type HydratedDocument,
	Schema,
} from "mongoose";
import { groupCatagoryEnum } from "../types/group.type";

export interface IGroup extends Document {
	name: string;
	description: string;
	image: string;
	memberCount: number;
	category: string;
	isPrivate: boolean;
	admin: mongoose.Types.ObjectId;
	members: mongoose.Types.ObjectId[];
	tags?: string[];
	lastActivity: string;
	createdAt: Date;
	updatedAt: Date;
}

const GroupSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			required: true,
		},
		memberCount: {
			type: Number,
			default: 0,
		},
		category: {
			type: String,
			required: true,
			enum: groupCatagoryEnum,
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		admin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		tags: [
			{
				type: String,
				trim: true,
			},
		],
		lastActivity: {
			type: String,
			default: "Just created",
		},
	},
	{
		timestamps: true,
	},
);

GroupSchema.pre("save", function (this: HydratedDocument<IGroup>, next) {
	if (this.isModified("members")) {
		this.memberCount = Array.isArray(this.members) ? this.members.length : 0;
	}
	next();
});
export default mongoose.model<IGroup>("Group", GroupSchema);
