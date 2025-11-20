import { model, Schema } from "mongoose";
import { ConnectionStatus } from "../types/enum";
import type { ConnectSchemaType } from "../types/schema";

// Connection Schema
const ConnectSchema = new Schema<ConnectSchemaType>(
	{
		requester: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		status: {
			type: String,
			enum: Object.values(ConnectionStatus),
			default: ConnectionStatus.PENDING,
			index: true,
		},
		requestedAt: { type: Date, default: Date.now, index: true },
		acceptedAt: { type: Date },
	},
	{ timestamps: true }, // optional: adds createdAt & updatedAt
);

// Compound indexes for faster queries
ConnectSchema.index({ requester: 1, status: 1 });
ConnectSchema.index({ recipient: 1, status: 1 });
ConnectSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Add validation to prevent self-connections and duplicates
ConnectSchema.pre("save", async function (next) {
	if (this.requester.toString() === this.recipient.toString()) {
		next(new Error("Cannot connect with yourself"));
	}
	next();
});

export default model<ConnectSchemaType>("Connect", ConnectSchema);
