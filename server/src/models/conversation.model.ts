import mongoose, { type Model, Schema } from "mongoose";
import type { IConversation } from "../types/message.type";

const conversationSchema = new Schema<IConversation>(
	{
		participants: [
			{ type: Schema.Types.ObjectId, ref: "User", required: true },
		],
		lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
		isGroup: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const Conversation: Model<IConversation> =
	mongoose.models.Conversation ||
	mongoose.model("Conversation", conversationSchema);

export default Conversation;
