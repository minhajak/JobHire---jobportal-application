import mongoose, { type Model, Schema } from "mongoose";
import type { IMessage } from "../types/message.type";

const messageSchema = new Schema<IMessage>(
	{
		conversation: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String },
		type: {
			type: String,
			enum: ["text", "image", "document", "audio", "location", "contact"],
			default: "text",
		},
		mediaUrl: { type: String },
		location: {
			lat: { type: Number },
			lng: { type: Number },
		},
		contact: {
			name: { type: String },
			phone: { type: String },
		},
		fileName: { type: String },
	},
	{ timestamps: true },
);

const Message: Model<IMessage> =
	mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
