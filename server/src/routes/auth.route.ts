import express from "express";
import {
//   getTokens,
  logout,
  refresh,
  requestOTP,
  signIn,
  signUp,
  verifyOTP,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Login a user
router.post("/sign-in", signIn);

// Register a user
router.post("/sign-up", signUp);

// Send OTP for email verification
router.post("/request-otp", requestOTP);

// Verify email verification OTP
router.post("/verify-otp", verifyOTP);

router.post("/refresh", refresh);

router.post("/logout", authMiddleware, logout);

// router.get("/tokens", authMiddleware, getTokens);
export default router;
