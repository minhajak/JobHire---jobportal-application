import mongoose from "mongoose";
import type { CompanyType } from "../types/schema";
import { LinkSchema } from "./profile.model";

const companySchema = new mongoose.Schema<CompanyType>(
	{
		name: { type: String, required: true },

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		industry: String, // eg: IT, Healthcare, EdTech

		specialties: [String], // eg: List of services, skills, or technologies

		estYear: Number, // eg: 2021

		size: String, // eg: 51-200 employees

		type: String, // eg: Private, Public, Non-profit, Government

		about: String,

		website: String,

		email: String,

		phone: String,

		logoUrl: String,

		bannerUrl: String,

		headquarters: String, // City, state, country of main office

		locations: [String], // Locations

		socialLinks: [LinkSchema],

		verified: { type: Boolean, default: false },

		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{
		timestamps: true,
	},
);

const Company = mongoose.model<CompanyType>("Company", companySchema);

export default Company;
