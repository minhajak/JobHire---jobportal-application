import express from "express";
import { requestOTP, verifyOTP } from "../controllers/auth.controller";
import {
	finalizeEmailChange,
	finalizePhoneChange,
	resetForgottenPassword,
	resetPassword,
	sendForgotPasswordOTP,
	sendResetPasswordOTP,
	verifyForgotPasswordOTP,
	verifyResetPasswordOTP,
} from "../controllers/reset-auth.controller";

const router = express.Router();

// Forgot Password routes (no authentication required)
router.post("/forgot-password-otp", sendForgotPasswordOTP);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
router.put("/reset-forgotten-password", resetForgottenPassword);

// Shared OTP routes
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

router.post("/request-password-otp", sendResetPasswordOTP);
router.post("/verify-password-otp", verifyResetPasswordOTP);

// Reset password
router.put("/reset-password", resetPassword);

// Email change
router.put("/finalize-email-change", finalizeEmailChange);

// Phone change
router.put("/finalize-phone-change", finalizePhoneChange);

export default router;
