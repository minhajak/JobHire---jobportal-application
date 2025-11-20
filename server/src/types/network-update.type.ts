import type mongoose from "mongoose";

export interface INetworkUpdate extends Document {
	userId: mongoose.Types.ObjectId;
	content: string;
	type: networkUpdateEnum;
	likes: mongoose.Types.ObjectId[];
	congratulations: mongoose.Types.ObjectId[];
	comments: Array<{
		_id: any;
		userId: mongoose.Types.ObjectId;
		content: string;
		createdAt: Date;
	}>;
	fullName: string;
	imageUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum networkUpdateEnum {
	ACHIEVEMENT = "achievement",
	JOB_CHANGE = "job_change",
	WORK_ANNIVERSARY = "work_anniversary",
	BIRTHDAY = "birthday",
	NEW_POSITION = "new_position",
}
