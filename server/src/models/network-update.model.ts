import mongoose, { Schema } from "mongoose";
import {
	type INetworkUpdate,
	networkUpdateEnum,
} from "../types/network-update.type";

const NetworkUpdateSchema: Schema = new Schema<INetworkUpdate>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: networkUpdateEnum,
			required: true,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		congratulations: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		fullName: {
			type: String,
		},
		imageUrl: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

export const NetworkUpdate = mongoose.model<INetworkUpdate>(
	"NetworkUpdate",
	NetworkUpdateSchema,
);
