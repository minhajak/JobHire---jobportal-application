// models/Event.ts
import mongoose, { type Model, Schema } from "mongoose";
import { eventTypeEnum, type IEvent, timeZoneEnum } from "../types/event.type";

const EventSchema = new Schema<IEvent>(
	{
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		coverImageUrl: {
			type: String,
		},
		eventType: {
			type: String,
			enum: Object.values(eventTypeEnum),
			default: eventTypeEnum.ONLINE,
			required: true,
		},
		eventName: {
			type: String,
			required: true,
			trim: true,
		},
		timeZone: {
			type: String,
			enum: timeZoneEnum,
		},
		startDateTime: {
			type: Date,
			required: true,
		},
		endDateTime: {
			type: Date,
		},
		externalLink: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
		},
		speakersId: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		attendeesId: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
		attendeesCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Keep attendeesCount in sync with attendeesId length (optional)
EventSchema.pre("save", function (next) {
	if (Array.isArray(this.attendeesId)) {
		this.attendeesCount = this.attendeesId.length;
	}
	next();
});

// If you add/remove attendees with update operations (findOneAndUpdate / updateOne),
// you may want to recompute attendeesCount in application logic or via middleware/hooks.

const Event: Model<IEvent> =
	mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
