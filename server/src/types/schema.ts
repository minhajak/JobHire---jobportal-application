import type mongoose from "mongoose";
import type { ConnectionStatus } from "./enum";

export interface OTPSchemaType extends Document {
	emailOrPhone: string;
	otp: string;
	otp_created_at: Date;
	is_verified: boolean;
}

export interface UserSchemaType extends Document {
	email?: string;
	phone?: string;
	password: string;
	provider: "Credentials" | "Google";
	createdAt?: Date;
	updatedAt?: Date;
	role?: "JobSeeker" | "Employer";
}

export interface ExperienceType {
	userId: mongoose.Types.ObjectId;
	title: string;
	company: string;
	companyId?: mongoose.Types.ObjectId;
	location?: string;
	locationType?: "onsite" | "remote" | "hybrid";
	startDate: Date;
	endDate?: Date;
	currentlyWorking: boolean;
	description?: string;
}

export interface EducationType {
	userId: mongoose.Types.ObjectId;
	school: string;
	degree: string;
	fieldOfStudy?: string;
	startDate: Date;
	endDate?: Date;
	grade?: string;
	description?: string;
}

export interface ProfileSchemaType extends Document {
	userId: mongoose.Types.ObjectId;
	fullName: string;
	imageUrl?: string;
	headline?: string;
	about?: string;
	contactEmail?: string;
	industry?: string;
	contactPhone?: string;
	link?: LinkType[];
	resume?: UserResumeType[];
}

export interface UserResumeType {
	_id?: string | mongoose.Types.ObjectId;
	url: string;
	fileName: string;
	uploadedAt?: Date;
}

export interface LinkType extends Document {
	_id?: string | mongoose.Types.ObjectId;
	name: string;
	url: string;
	order: number;
}

export interface CompanyType {
	_id?: mongoose.Types.ObjectId;
	name: string;
	createdBy: mongoose.Types.ObjectId;
	industry?: string;
	specialties?: string[];
	estYear?: number;
	size?: string;
	type?: string;
	about?: string;
	website?: string;
	email?: string;
	phone?: string;
	logoUrl?: string;
	bannerUrl?: string;
	headquarters?: string;
	locations?: string[];
	socialLinks?: LinkType[];
	verified?: boolean;
	followers?: mongoose.Types.ObjectId[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface EmployeeType {
	userId: mongoose.Types.ObjectId;
	companyId: mongoose.Types.ObjectId;
	position: string;
	department?: string;
	startDate?: Date;
	endDate?: Date;
	isVerified?: boolean;
	isCurrent?: boolean;
}

export interface ConnectSchemaType extends Document {
	requester: mongoose.Types.ObjectId;
	recipient: mongoose.Types.ObjectId;
	status: ConnectionStatus;
	requestedAt: Date;
	acceptedAt?: Date;
}
