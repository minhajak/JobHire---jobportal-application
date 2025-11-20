import mongoose, { Schema, Document } from 'mongoose';
import { IToken } from '../types/token.type';

const tokenSchema = new Schema<IToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    device: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic token cleanup
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for finding user tokens
tokenSchema.index({ userId: 1, expiresAt: 1 });

export const Token = mongoose.model<IToken>('Token', tokenSchema);