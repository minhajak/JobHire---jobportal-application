import mongoose, { type Model, type Schema } from "mongoose";
import type { UserSchemaType } from "../types/schema";

const usersSchema: Schema<UserSchemaType> = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			lowercase: true,
			sparse: true,
		},
		phone: {
			type: String,
			unique: true,
			sparse: true,
		},
		password: {
			type: String,
			required: true,
		},
		provider: {
			type: String,
			default: "Credentials",
			enum: ["Credentials", "Google"],
		},
		role: { type: String, enum: ["JobSeeker", "Employer"], default: null },
	},
	{ timestamps: true },
);

const User: Model<UserSchemaType> =
	mongoose.models.User || mongoose.model<UserSchemaType>("User", usersSchema);

export default User;
