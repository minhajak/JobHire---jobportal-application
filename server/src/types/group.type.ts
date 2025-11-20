import type mongoose from "mongoose";

export enum groupCatagoryEnum {
	TECHNOLOGY = "technology",
	DESIGN = "design",
	BUSINESS = "business",
	MARKETING = "marketing",
	STARTUP = "startup",
	LEADERSHIP = "leadership",
	NETWORKING = "networking",
	DEVELOPMENT = "development",
	includes = "includes",
}

export enum groupRequestStatus {
	ACCEPTED = "accepted",
	REJECTED = "rejected",
	PENDING = "pending",
}
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

export interface IGroupRequest extends Document {
	requester: mongoose.Types.ObjectId;
	group: mongoose.Types.ObjectId;
	status: groupRequestStatus;
	requestedAt: Date;
	acceptedAt: Date;
}
