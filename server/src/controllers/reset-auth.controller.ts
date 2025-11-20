import type { Request, Response } from "express";
import mongoose from "mongoose";
import OTP from "../models/otp.model";
import User from "../models/user.model";
import { generateOtp } from "../utils/generate-otp";
import { compareHashedPassword, hashPassword } from "../utils/hash";
import { decryptString, encryptString } from "../utils/jwt-token";
import { sanitizeInput } from "../utils/sanitize";
import { sendEmailOTP, sendSMSOTP } from "../utils/send-otp";
import {
	emailSchema,
	passwordSchema,
	phoneSchema,
} from "../validations/auth.validation";

// ------------------ Forgot Password (Unauthenticated) ------------------

export const sendForgotPasswordOTP = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email } = req.body;

		if (!email) {
			res.status(400).json({ message: "Email is required" });
			return;
		}

		// Validate email, if invalid throws error and that will be handled by errorMiddleware
		emailSchema.parse(email);

		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			// Don't reveal if user exists or not for security
			res.status(200).json({
				message: "If an account with this email exists, an OTP has been sent.",
			});
			return;
		}

		const otp = generateOtp();
		await OTP.updateOne(
			{ emailOrPhone: email },
			{
				$set: {
					otp,
					otp_created_at: new Date(),
					is_verified: false,
				},
			},
			{ upsert: true },
		);

		sendEmailOTP({ email, otp });

		res.status(200).json({
			message: "If an account with this email exists, an OTP has been sent.",
		});
	} catch (error) {
		console.log("Error in sending forgot password OTP:", error);
		res.status(500).json({ message: "Failed to send OTP", error });
	}
};

export const verifyForgotPasswordOTP = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			res.status(400).json({ message: "Email and OTP are required" });
			return;
		}

		// Validate email
		emailSchema.parse(email);

		const otpRecord = await OTP.findOne({
			emailOrPhone: email,
			otp,
			otp_created_at: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // valid for 15 minutes
		});

		if (!otpRecord) {
			res.status(400).json({ message: "Invalid or expired OTP" });
			return;
		}

		otpRecord.is_verified = true;
		await otpRecord.save();

		const encryptedOTP = encryptString({ otpId: otpRecord._id });

		res
			.status(200)
			.json({ message: "OTP verified successfully", encryptedOTP });
	} catch (error) {
		console.log("Error in verifying forgot password OTP:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

export const resetForgottenPassword = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { email, newPassword, encryptedOTP } = req.body;

		if (!email || !newPassword || !encryptedOTP) {
			res
				.status(400)
				.json({ message: "Email, password, and encrypted OTP are required" });
			return;
		}

		const cleanedPassword = sanitizeInput(newPassword);

		// Validate password, if invalid throws error and that will be handled by errorMiddleware
		passwordSchema.parse(newPassword);

		// Check if xss attack detected then return
		if (cleanedPassword !== newPassword) {
			res.status(400).json({
				message: "Invalid password format or suspicious characters detected.",
			});
			return;
		}

		// Find user by email
		const user = await User.findOne({ email });

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		let otpRecord;
		try {
			const { otpId } = decryptString(encryptedOTP);
			otpRecord = await OTP.findOneAndDelete({
				_id: new mongoose.Types.ObjectId(otpId),
				emailOrPhone: email,
				is_verified: true,
			});
		} catch (err) {
			res
				.status(400)
				.json({ message: "Invalid or expired OTP. Please try again." });
			return;
		}

		if (!otpRecord) {
			res.status(400).json({ message: "OTP verification failed" });
			return;
		}

		user.password = await hashPassword(newPassword);
		await user.save();

		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		console.log("Error in resetting forgotten password:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

// ------------------ Change Email ------------------

export const finalizeEmailChange = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const userId = req.user?.userId;
	const { newEmail, password, encryptedOTP } = req.body;

	try {
		// Validate email id, if invalid throws error and that will be handled by errorMiddleware
		emailSchema.parse(newEmail);

		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const isPasswordCorrect = await compareHashedPassword(
			password,
			user.password,
		);
		if (!isPasswordCorrect) {
			res.status(400).json({ message: "Incorrect password" });
			return;
		}

		const { otpId } = decryptString(encryptedOTP);

		const otpRecord = await OTP.findOneAndDelete({
			_id: new mongoose.Types.ObjectId(otpId),
			emailOrPhone: newEmail,
			is_verified: true,
		});

		if (!otpRecord) {
			res.status(400).json({ message: "OTP verification failed" });
			return;
		}

		const existingUser = await User.findOne({ email: newEmail });
		if (existingUser) {
			res.status(400).json({ message: "Email already in use" });
			return;
		}

		user.email = newEmail;
		await user.save();

		res.status(200).json({ message: "Email successfully changed" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// ------------------ Change Phone ------------------

export const finalizePhoneChange = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { newPhone, password, encryptedOTP } = req.body;

		// Validate Phone number, if invalid throws error and that will be handled by errorMiddleware
		phoneSchema.parse(newPhone);

		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const isPasswordCorrect = await compareHashedPassword(
			password,
			user.password,
		);
		if (!isPasswordCorrect) {
			res.status(400).json({ message: "Incorrect password" });
			return;
		}

		const { otpId } = decryptString(encryptedOTP);
		const otpRecord = await OTP.findOneAndDelete({
			_id: new mongoose.Types.ObjectId(otpId),
			emailOrPhone: newPhone,
			is_verified: true,
		});

		if (!otpRecord) {
			res.status(400).json({ message: "OTP verification failed" });
			return;
		}

		const existingUser = await User.findOne({ phone: newPhone });
		if (existingUser) {
			res.status(400).json({ message: "Phone already in use" });
			return;
		}

		user.phone = newPhone;
		await user.save();

		res.status(200).json({ message: "Phone successfully changed" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const sendResetPasswordOTP = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const userId = req.user?.userId;

	try {
		const user = await User.findById(userId);

		const emailOrPhone = user?.email || user?.phone;

		if (!user || !emailOrPhone) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const otp = generateOtp();
		await OTP.updateOne(
			{ emailOrPhone },
			{
				$set: {
					otp,
					otp_created_at: new Date(),
					is_verified: false,
				},
			},
			{ upsert: true },
		);

		if (emailOrPhone.includes("@")) {
			await sendEmailOTP({ email: emailOrPhone, otp });
		} else {
			await sendSMSOTP({ phone: emailOrPhone, otp });
		}

		res.status(200).json({ message: "OTP sent successfully" });
	} catch (error) {
		console.log("Error in sending password reset OTP :", error);
		res.status(500).json({ message: "Failed to send OTP", error });
	}
};

export const verifyResetPasswordOTP = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { otp } = req.body;

	try {
		const userId = req.user?.userId;
		const user = await User.findById(userId);

		const emailOrPhone = user?.email || user?.phone;

		const otpRecord = await OTP.findOne({
			emailOrPhone,
			otp,
			otp_created_at: { $gt: new Date(Date.now() - 15 * 60 * 1000) }, // valid for 15 minutes
		});

		if (!otpRecord) {
			res.status(400).json({ message: "Invalid or expired OTP" });
			return;
		}

		otpRecord.is_verified = true;
		await otpRecord.save();

		const encryptedOTP = encryptString({ otpId: otpRecord._id });

		res.status(200).json({ message: "OTP verified", encryptedOTP });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const resetPassword = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const userId = req.user?.userId;
	const { newPassword, encryptedOTP } = req.body;

	const user = await User.findById(userId);

	const emailOrPhone = user?.email || user?.phone;
	try {
		const cleanedPassword = sanitizeInput(newPassword);

		// Validate password, if invalid throws error and that will be handled by errorMiddleware
		passwordSchema.parse(newPassword);

		// Check if xss attack detected then return
		if (cleanedPassword !== newPassword) {
			res.status(400).json({
				message: "Invalid password format or suspicious characters detected.",
			});
			return;
		}

		const user = await User.findById(userId);

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		let otpRecord;
		try {
			const { otpId } = decryptString(encryptedOTP);
			otpRecord = await OTP.findOneAndDelete({
				_id: new mongoose.Types.ObjectId(otpId),
				emailOrPhone,
				is_verified: true,
			});
		} catch (err) {
			res
				.status(400)
				.json({ message: "Invalid or expired OTP. Please try again." });
			return;
		}

		if (!otpRecord) {
			res.status(400).json({ message: "OTP verification failed" });
			return;
		}

		user.password = await hashPassword(newPassword);
		await user.save();

		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
