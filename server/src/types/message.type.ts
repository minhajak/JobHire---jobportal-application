import type mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IConversation extends Document {
	participants: mongoose.Types.ObjectId[];
	lastMessage?: mongoose.Types.ObjectId | null;
	isGroup: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IMessage extends Document {
	conversation: mongoose.Types.ObjectId;
	sender: mongoose.Types.ObjectId;
	content?: string;
	type: "text" | "image" | "document" | "audio" | "location" | "contact";
	location?: { lat: number; lng: number };
	contact?: { name: string; phone: string };
	mediaUrl?: string;
	fileName?: string;
	createdAt: Date;
}
