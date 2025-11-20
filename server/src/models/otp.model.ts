import mongoose, { type Model, type Schema } from "mongoose";
import type { OTPSchemaType } from "../types/schema";

const otpSchema: Schema<OTPSchemaType> = new mongoose.Schema(
	{
		emailOrPhone: {
			type: String,
			unique: true,
			sparse: true,
		},
		otp: {
			type: String,
		},
		otp_created_at: {
			type: Date,
			default: Date.now,
		},
		is_verified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const OTP: Model<OTPSchemaType> =
	mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export default OTP;
