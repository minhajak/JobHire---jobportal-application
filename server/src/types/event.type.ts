import type mongoose from "mongoose";

export interface IEvent extends Document {
	creatorId: mongoose.Types.ObjectId;
	coverImageUrl: string;
	eventType: string;
	eventName: string;
	timeZone?: string;
	// combined date + time fields (recommended)
	startDateTime: Date;
	endDateTime?: Date;
	externalLink?: string;
	description?: string;
	speakersId?: mongoose.Types.ObjectId[]; // refs to User (or Speaker) documents
	attendeesId?: mongoose.Types.ObjectId[]; // refs to User documents
	attendeesCount?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export enum eventTypeEnum {
	ONLINE = "online",
	OFFLINE = "offline",
	HYBRID = "hybrid",
	OTHER = "other",
}

export enum timeZoneEnum {
	UTC_MINUS_5 = "UTC-05:00 (New York, Toronto)",
	UTC_MINUS_4 = "UTC-04:00 (Santiago, Caracas)",
	UTC_MINUS_3 = "UTC-03:00 (Rio de Janeiro, Buenos Aires)",
	UTC_PLUS_0 = "UTC+00:00 (London, Lisbon)",
	UTC_PLUS_1 = "UTC+01:00 (Berlin, Lagos, Paris)",
	UTC_PLUS_2 = "UTC+02:00 (Cairo, Johannesburg)",
	UTC_PLUS_3 = "UTC+03:00 (Moscow, Riyadh)",
	UTC_PLUS_4 = "UTC+04:00 (Dubai, Baku)",
	UTC_PLUS_5 = "UTC+05:00 (Tashkent, Islamabad)",
	UTC_PLUS_5_30 = "UTC+05:30 (Chennai, Kolkata, Mumbai, New Delhi, Sri Lanka)",
	UTC_PLUS_5_45 = "UTC+05:45 (Kathmandu)",
	UTC_PLUS_6 = "UTC+06:00 (Dhaka, Almaty)",
	UTC_PLUS_6_30 = "UTC+06:30 (Yangon)",
	UTC_PLUS_7 = "UTC+07:00 (Bangkok, Jakarta)",
	UTC_PLUS_8 = "UTC+08:00 (Beijing, Singapore, Perth)",
	UTC_PLUS_9 = "UTC+09:00 (Tokyo, Seoul)",
	UTC_PLUS_10 = "UTC+10:00 (Sydney, Vladivostok)",
	UTC_PLUS_11 = "UTC+11:00 (Solomon Is., New Caledonia)",
	UTC_PLUS_12 = "UTC+12:00 (Fiji, Kamchatka)",
}
