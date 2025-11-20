import jwt, { TokenExpiredError } from "jsonwebtoken";
import type { Types } from "mongoose";
import { getEnvVariable } from "./helpers";

const JWT_SECRET = getEnvVariable("JWT_SECRET");

export interface TokenPayloadType {
  userId: Types.ObjectId | null;
  role: "JobSeeker" | "Employer" | null;
}
interface OTPPayloadType {
  otpId: Types.ObjectId;
}

export const generateTokens = (payload: TokenPayloadType) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m", // make it 15 min of production mode
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as TokenPayloadType;
};

export const refreshAccessToken = (refreshToken: string) => {
  const decoded = verifyToken(refreshToken);
  return generateTokens({
    userId: decoded.userId,
    role: decoded.role,
  });
};

export const encryptString = (payload: OTPPayloadType) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const decryptString = (payload: string) => {
  return jwt.verify(payload, JWT_SECRET) as OTPPayloadType;
};
