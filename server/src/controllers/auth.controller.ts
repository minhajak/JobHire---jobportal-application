import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import xss from "xss";
import OTP from "../models/otp.model";
import User from "../models/user.model";
import type { UserSchemaType } from "../types/schema";
import { generateOtp } from "../utils/generate-otp";
import { compareHashedPassword, hashPassword } from "../utils/hash";
import {
  decryptString,
  encryptString,
  generateTokens,
  refreshAccessToken,
  type TokenPayloadType,
  verifyToken,
} from "../utils/jwt-token";
import { sendEmailOTP, sendSMSOTP } from "../utils/send-otp";
import {
  emailOrPhone,
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "../validations/auth.validation";
import { Token } from "../models/token.model";
import { UAParser } from "ua-parser-js";

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided." });
      return;
    }

    // Verify refresh token signature before DB lookup
    let decodedRefresh: TokenPayloadType;
    try {
      decodedRefresh = verifyToken(refreshToken);
    } catch {
      res.status(401).json({ message: "Invalid or expired refresh token." });
      return;
    }

    // Check if token exists in database
    const tokenExists = await Token.exists({ token: refreshToken });

    if (!tokenExists) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new access token
    const { accessToken } = refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    next(error);
  }
};
/**
 * Logout endpoint - clears the refresh token cookie and returns success.
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (refreshToken) {
      await Token.findOneAndDelete({ token: refreshToken });
    }
    // Clear cookie; also set cookie to expired as a fallback
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Changed
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Some browsers/clients may require an explicit expired cookie
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Changed
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Error in logout :", error);
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract data from the body
    const { password } = req.body;

    // Identify as email or phone
    const { email, phone } = emailOrPhone(req.body.emailOrPhone);

    // Checks
    if (!(email || phone) || !password) {
      res
        .status(400)
        .json({ message: "Email/Phone number and password are required." });
      return;
    }

    let user;
    if (email) user = await User.findOne({ email });
    if (!user && phone) user = await User.findOne({ phone });

    if (!user) {
      res
        .status(401)
        .json({ message: "Invalid email or password. Please try again." });
      return;
    }

    // Verify the password
    const isMatch = await compareHashedPassword(password, user?.password);
    if (!isMatch) {
      res
        .status(401)
        .json({ message: "Invalid email or password. Please try again." });
      return;
    }

    // Generate JWT token
    const { accessToken, refreshToken } = generateTokens({
      userId: user?._id,
      role: user?.role || null,
    });
    if (!user._id) {
      res.status(401).json({ message: "No user Id. Please try again." });
      return;
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    // Calculate refresh token expiration (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Parse device info using ua-parser-js
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const deviceInfo = `${result.browser.name ?? "Unknown"} ${
      result.browser.version || ""
    } on ${result.os.name || "Unknown"} ${result.os.version || ""} (${
      result.device.type || "desktop"
    })`.trim();

    try {
      await Token.create({
        userId: userId,
        token: refreshToken,
        expiresAt: expiresAt,
        device: deviceInfo,
      });
    } catch (error) {
      // Handle duplicate key error
      if (error instanceof Error && "code" in error && error.code === 11000) {
        console.log("Duplicate token detected. This token already exists.");
      } else {
        throw error;
      }
    }
    // Update the refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Changed
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: userId,
        email: user?.email,
        phone: user?.phone,
      },
    });
  } catch (error) {
    console.error("Error in sign in :", error);
    next(error);
  }
};

// Send OTP
export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Identify as email or phone
    const { email, phone } = emailOrPhone(req.body.emailOrPhone);

    if (!email && !phone) {
      res.status(400).json({
        message:
          "Either a valid email or a valid phone number is required to verify OTP.",
      });
      return;
    }

    if (email) {
      emailSchema.parse(email);
    } else if (phone) {
      phoneSchema.parse(phone);
    }

    if (
      (email && email !== req.body.emailOrPhone) ||
      (phone && phone !== req.body.emailOrPhone)
    ) {
      res.status(400).json({ error: "Suspicious characters detected." });
      return;
    }

    const identifier = email || phone;

    // **OPTIMIZATION 1: Parallel database queries**
    const [existingUser, existingOTP] = await Promise.all([
      User.findOne({
        provider: "Credentials",
        ...(email ? { email } : { phone }),
      }),
      OTP.findOne({ emailOrPhone: identifier }),
    ]);

    if (existingUser) {
      res.status(409).json({
        message: "User already exists. Please sign in.",
      });
      return;
    }

    // Check cooldown
    if (existingOTP) {
      const cooldownMinutes = 1;
      const now = new Date();
      const otpCreatedAt = new Date(existingOTP.otp_created_at);

      if (otpCreatedAt && !isNaN(otpCreatedAt.getTime())) {
        const timeDiff = (now.getTime() - otpCreatedAt.getTime()) / (1000 * 60);
        if (timeDiff < cooldownMinutes) {
          const waitTime = Math.ceil(cooldownMinutes - timeDiff);
          res.status(429).json({
            message: `Please wait ${waitTime} minute${
              waitTime > 1 ? "s" : ""
            } before requesting a new OTP.`,
          });
          return;
        }
      }
    }

    // Generate OTP
    const otp = await generateOtp();

    // **OPTIMIZATION 2: Update DB and send OTP in parallel**
    Promise.all([
      OTP.updateOne(
        { emailOrPhone: identifier },
        {
          $set: {
            otp,
            otp_created_at: new Date(),
            is_verified: false,
          },
        },
        { upsert: true }
      ),
      // Send OTP asynchronously without blocking response
      (email
        ? sendEmailOTP({ email, otp })
        : sendSMSOTP({ phone: phone!, otp })
      ).catch((err) => {
        // Log error but don't block the response
        console.error("Error sending OTP:", err);
      }),
    ]);

    const successMessage = email ? "email." : "phone number.";

    res.status(201).json({
      message: `OTP sent successfully. Please check your registered ${successMessage}`,
    });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract data from the body and sanitize it
    const otp = xss(req.body?.otp?.toString()?.trim() || null);

    // Identify as email or phone
    const { email, phone } = emailOrPhone(req.body?.emailOrPhone);

    if (!(email || phone)) {
      res.status(401).json({ message: "Unauthorized access." });
      return;
    }

    if (!otp) {
      res.status(400).json({ message: "OTP is required." });
      return;
    }

    // Find user with email and non-expired OTP
    const existingOTP = await OTP.findOneAndUpdate(
      {
        emailOrPhone: email || phone,
        otp,
        otp_created_at: {
          $gt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins
        },
      },
      {
        $set: {
          is_verified: true,
        },
      }
    );

    if (!existingOTP) {
      res.status(400).json({
        message: "Invalid OTP or OTP has expired. Please request a new one.",
      });
      return;
    }

    const encryptedVerification = encryptString({ otpId: existingOTP._id });

    console.log("encrypted opt", encryptedVerification);
    res.status(200).json({
      success: true,
      message: "Verification successfull!",
      encryptedOTP: encryptedVerification,
    });
  } catch (error) {
    console.error("Error in verifying OTP :", error);
    next(error);
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, encryptedOTP, username } = req.body;

    if (!encryptedOTP) {
      res.status(400).json({ message: "Please verify the OTP." });
      return;
    }

    // Filter xss from the inputs
    const cleanedPassword = xss(req.body?.password?.toString()?.trim());

    // Identify as email or phone
    const { email, phone } = emailOrPhone(req.body?.emailOrPhone);

    // Validate password
    passwordSchema.parse(password);

    // Check if xss attack detected then return
    if (cleanedPassword !== password) {
      res.status(400).json({
        message: "Invalid password format or suspicious characters detected.",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      provider: "Credentials",
      ...(email ? { email } : { phone }),
    });

    if (existingUser) {
      res.status(409).json({
        message: "User already exists. Please sign in.",
      });
      return;
    }

    // Decrypt OTP and verify
    let otpUser;
    try {
      const { otpId } = decryptString(encryptedOTP);
      if (otpId) {
        otpUser = await OTP.findOneAndDelete({
          emailOrPhone: email || phone,
          _id: otpId,
        });
      }
    } catch (err) {
      res.status(400).json({
        message: "Request expired. Please request a new OTP.",
        error: err,
      });
      return;
    }

    if (!otpUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const message: string = email ? "email." : "phone number.";

    if (!otpUser.is_verified) {
      res.status(400).json({
        message: `Please verify your registered ${message}`,
      });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the DB
    const userData: Partial<UserSchemaType> = {
      password: hashedPassword,
      provider: "Credentials",
    };

    if (email) userData.email = email;
    if (phone) userData.phone = phone;

    const user = new User(userData);
    const savedUser = await user.save();

    // Generate JWT token
    const { accessToken, refreshToken } = generateTokens({
      userId: savedUser._id,
      role: null,
    });

    // Calculate refresh token expiration (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Parse device info using ua-parser-js
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const deviceInfo = `${result.browser.name || "Unknown"} ${
      result.browser.version || ""
    } on ${result.os.name || "Unknown"} ${result.os.version || ""} (${
      result.device.type || "desktop"
    })`.trim();

    // Create token with device info and expiration
    await Token.create({
      userId: savedUser._id as mongoose.Types.ObjectId,
      token: refreshToken,
      expiresAt,
      device: deviceInfo,
    });

    // Set refresh token in the cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      accessToken,
      user: {
        id: savedUser._id,
        email: savedUser?.email,
        phone: savedUser?.phone,
      },
    });
  } catch (error) {
    console.error("Error in sign up:", error);
    next(error);
  }
};

// export const getTokens = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;

//     const tokens = await Token.find();
//     // await Token.collection.drop();

//     res.status(200).json({ tokens });
//   } catch (error) {
//     res.status(500).json({ meessage: "internal server error", error: error });
//   }
// };
