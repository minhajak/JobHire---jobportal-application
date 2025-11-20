import type mongoose from "mongoose";

export interface Ipage extends Document {
	id?: string;
	creatorId: mongoose.Types.ObjectId;
	name: string;
	website?: string;
	industry?: string;
	organisationSize: string;
	organisationType: OrganisationType;
	logo: string;
	tagline: string;
	followers: string[];
	followerCount: number;
	createdAt: Date;
	updatedAt: Date;
}
export enum OrganisationType {
	PUBLIC_COMPANY = "Public Company",
	PRIVATE_COMPANY = "Private Company",
	SELF_EMPLOYED = "Self Employed",
	GOVERNMENT_AGENCY = "Government Agency",
	NON_PROFIT = "Non Profit",
	SOLE_PROPRIETORSHIP = "Sole Proprietorship",
	PARTNERSHIP = "Partnership",
	EDUCATIONAL = "Educational",
	STARTUP = "Startup",
}
export enum OrganisationSize {
	SELF_EMPLOYED = "0-1 employees",
	SMALL = "2-10 employees",
	MEDIUM = "11-50 employees",
	LARGE = "51-200 employees",
	VERY_LARGE = "201-500 employees",
	ENTERPRISE = "501-1000 employees",
	MEGA = "1001-5000 employees",
	GIANT = "5001-10000 employees",
	MASSIVE = "10001+ employees",
}
