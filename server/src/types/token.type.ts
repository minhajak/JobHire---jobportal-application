import mongoose from "mongoose";

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  device?: string;
  createdAt: Date;
  updatedAt: Date;
}