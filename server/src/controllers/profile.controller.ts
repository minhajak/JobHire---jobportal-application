import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Education from "../models/education.model";
import Experience from "../models/experience.model";
import Profile from "../models/profile.model";
import type {
	LinkType,
	ProfileSchemaType,
	UserResumeType,
} from "../types/schema";
import { sanitizeInput } from "../utils/sanitize";
import {
	educationSchema,
	experienceSchema,
	profileSchema,
} from "../validations/profile.validation";

// Add or update user profile
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const filePath = req?.file?.path;
		const userId = req.user?.userId;
		const body = sanitizeInput(req.body);

		// Validate Profile inputs , if invalid throws error and that will be handled by errorMiddleware
		profileSchema.parse(body);

		const updateData: Partial<ProfileSchemaType> = {
			fullName: body?.fullName,
			about: body?.about,
			headline: body?.headline,
			contactEmail: body?.contactEmail,
			contactPhone: body?.contactPhone,
			imageUrl: body?.imageUrl,
		};

		if (filePath) {
			updateData.imageUrl = filePath;
		}

		// Update if exists, insert if not
		const updatedUser = await Profile.findOneAndUpdate(
			{ userId },
			{ $set: updateData },
			{ upsert: true, new: true },
		);

		res.status(200).json({
			message: "Profile updated successfully.",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error in updating profile:", error);
		next(error);
	}
};

// Get user profile by user ID
export const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { userId } = req.params;

		// Find user profile by user id
		const user = await Profile.findOne({ userId });

		if (!user) {
			res.status(404).json({ message: "Profile not found." });
			return;
		}

		res.status(200).json({ message: "Profile fetched successfully.", user });
	} catch (error) {
		console.error("Error in fetching user profile:", error);
		next(error);
	}
};
export const getCurrentUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		// Find user profile by user id
		const user = await Profile.findOne({ userId });

		if (!user) {
			res.status(404).json({ message: "Profile not found." });
			return;
		}

		res.status(200).json({ message: "Profile fetched successfully.", user });
	} catch (error) {
		console.error("Error in fetching user profile:", error);
		next(error);
	}
};

// Delete user profile by user ID
export const deleteProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		// Delete user profile by authenticated user id
		const deletedProfile = await Profile.findOneAndDelete({ userId });

		// Delete related documents
		await Promise.all([
			Education.deleteMany({ userId }),
			Experience.deleteMany({ userId }),
		]);

		if (!deletedProfile) {
			res.status(404).json({ message: "Profile not found." });
			return;
		}

		res
			.status(200)
			.json({ message: "Profile and related data deleted successfully." });
	} catch (error) {
		console.error("Error deleting profile:", error);
		next(error);
	}
};

// POST /api/profile/resume
export const uploadResume = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user.userId;
		const file = req.file;

		if (!file) {
			return;
		}

		const uploadedFileUrl = file.path;
		const originalName = file.originalname;

		const resume: UserResumeType = {
			url: uploadedFileUrl,
			fileName: originalName,
			uploadedAt: new Date(),
		};

		const profile = await Profile.findOne({ userId });

		if (profile) {
			if (!profile.resume) {
				profile.resume = [];
			}

			profile.resume.push(resume);
			await profile.save();
		} else {
			await Profile.create({
				userId,
				fullName: "Unknown",
				resume: [resume],
			});
		}

		res.status(200).json({
			message: "Resume uploaded successfully",
			resume,
		});
	} catch (error) {
		console.error("Error uploading resume:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// get resume
export const getUserResume = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { userId } = req.params;
		const profile = await Profile.findOne({ userId });

		if (!profile || !profile.resume || profile.resume.length === 0) {
			res.status(404).json({ message: "No resume found for this user." });
			return;
		}

		res.status(200).json({
			success: true,
			resume: profile.resume,
		});
	} catch (error) {
		console.error("Error fetching resume:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getResumeFile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { resId } = req.params;

		// Validate resume ID
		if (!mongoose.Types.ObjectId.isValid(resId)) {
			res.status(400).json({ message: "Invalid resume ID" });
			return;
		}

		// Find profile containing the resume
		const profile = await Profile.findOne({ "resume._id": resId });

		if (!profile || !profile.resume) {
			res.status(404).json({ message: "Resume not found" });
			return;
		}

		// Find the specific resume
		const resume = (profile.resume as UserResumeType[]).find(
			(r) => r._id?.toString() === resId,
		);

		if (!resume) {
			res.status(404).json({ message: "Resume not found in profile" });
			return;
		}

		// Send back resume details
		res.status(200).json({
			message: "Resume fetched successfully",
			resume: {
				url: resume.url,
				fileName: resume.fileName,
			},
		});
	} catch (error) {
		console.error("Error fetching resume file:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteResume = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user.userId;
		const { resId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(resId)) {
			res.status(400).json({ message: "Invalid resume ID" });
			return;
		}

		const profile = await Profile.findOne({ userId });

		if (!profile || !profile.resume) {
			res.status(404).json({ message: "Profile or resume not found" });
			return;
		}

		const updatedResume = profile.resume.filter(
			(r) => r._id?.toString() !== resId,
		);

		if (updatedResume.length === profile.resume.length) {
			res.status(404).json({ message: "Resume not found in profile" });
			return;
		}

		profile.resume = updatedResume;
		await profile.save();

		res.status(200).json({ message: "Resume deleted successfully" });
	} catch (error) {
		console.error("Error deleting resume:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addUserLinks = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user.userId;
		const { links } = req.body;

		// Validate links array
		if (!Array.isArray(links) || links.length === 0) {
			res.status(400).json({ message: "Links must be a non-empty array." });
		}

		if (links.length > 10) {
			res.status(400).json({ message: "You can only add up to 10 links." });
		}

		// Basic validation for each link
		for (const link of links) {
			if (!link.name || !link.url) {
				res
					.status(400)
					.json({ message: "Each link must have a name and url." });
			}
		}

		// Find profile
		let profile = await Profile.findOne({ userId });

		if (profile) {
			(profile as any).links = links;
			await profile.save();
		} else {
			profile = await Profile.create({
				userId,
				fullName: "Unknown",
				links,
			});
		}

		res.status(200).json({
			message: "Links updated successfully.",
			links: profile.links,
		});
	} catch (error) {
		console.error("Error adding/updating links:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserLinks = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { userId } = req.params;
		const profile = await Profile.findOne({ userId });

		if (!profile || !profile.links || profile.links.length === 0) {
			res.status(404).json({ message: "No links found for this user." });
			return;
		}

		res.status(200).json({ success: true, links: profile.links });
	} catch (error) {
		console.error("Error fetching user links:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteUserLink = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user.userId;
		const { linkId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(linkId)) {
			res.status(400).json({ message: "Invalid link ID." });
			return;
		}

		const profile = await Profile.findOne({ userId });

		if (!profile || !Array.isArray(profile.links)) {
			res.status(404).json({ message: "Profile or links not found." });
			return;
		}

		const originalLength = profile.links.length;

		const updatedLinks: LinkType[] = profile.links.filter(
			(link: LinkType) => link._id?.toString() !== linkId,
		);

		if (updatedLinks.length === originalLength) {
			res.status(404).json({ message: "Link not found." });
			return;
		}

		profile.link = updatedLinks;
		await profile.save();

		res.status(200).json({
			message: "Link deleted successfully",
			links: profile.links,
		});
	} catch (error) {
		console.error("Error deleting link:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const editUserLink = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user.userId;
		const { linkId } = req.params;
		const { name, url, order } = req.body;

		// Validate input
		if (!name || !url) {
			res.status(400).json({ message: "Name and URL are required." });
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(linkId)) {
			res.status(400).json({ message: "Invalid link ID." });
			return;
		}

		// Find profile
		const profile = await Profile.findOne({ userId });

		if (!profile || !Array.isArray(profile.links)) {
			res.status(404).json({ message: "Profile or links not found." });
			return;
		}

		// Find the specific link by ID
		const link = profile.links.find(
			(link: any) => link._id?.toString() === linkId,
		);

		if (!link) {
			res.status(404).json({ message: "Link not found." });
			return;
		}

		// Update fields
		link.name = name;
		link.url = url;
		link.order = order ?? link.order;

		await profile.save();

		res.status(200).json({
			message: "Link updated successfully",
			link,
		});
	} catch (error) {
		console.error("Error editing user link:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addOrUpdateEducation = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const data = sanitizeInput(req.body);

	// Validate education inputs, if invalid throws error and that will be handled by errorMiddleware
	educationSchema.parse(data);

	const userId = req.user?.userId;

	try {
		let saved;

		// Update if education id already exists
		if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
			const updated = await Education.findByIdAndUpdate(
				data._id,
				{
					userId,
					school: data.school,
					degree: data.degree,
					fieldOfStudy: data?.fieldOfStudy || "",
					startDate: data.startDate,
					endDate: data.endDate || null,
					grade: data?.grade || "",
					description: data?.description || "",
				},
				{ new: true },
			);
			if (!updated) {
				res.status(404).json({ message: "Education entry not found" });
				return;
			}
			saved = updated;
		} else {
			// Create new
			const newEducation = new Education({
				userId,
				school: data.school,
				degree: data.degree,
				fieldOfStudy: data?.fieldOfStudy || "",
				startDate: data.startDate,
				endDate: data?.endDate || null,
				grade: data?.grade || "",
				description: data?.description || "",
			});
			saved = await newEducation.save();
		}

		res.status(200).json(saved);
	} catch (err) {
		console.log("Error in adding/updating education :", err);
		next(err);
	}
};

export const getEducationByUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { userId } = req.params;

	try {
		const educationList = await Education.find({ userId }).sort({
			startDate: -1,
		});
		res.status(200).json(educationList);
	} catch (err) {
		console.log("Error in adding/updating education :", err);
		next(err);
	}
};

export const deleteEducation = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { eduId } = req.params;
	const userId = req.user?.userId;

	if (!mongoose.Types.ObjectId.isValid(eduId)) {
		res.status(400).json({ message: "Invalid education ID" });
		return;
	}

	try {
		const deleted = await Education.findOneAndDelete({ _id: eduId, userId });

		if (!deleted) {
			res
				.status(404)
				.json({ message: "Education entry not found or not authorized" });
			return;
		}

		res.status(200).json({ message: "Education entry deleted successfully" });
	} catch (err) {
		console.log("Error in adding/updating education :", err);
		next(err);
	}
};

export const getExperiencesByUser = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { userId } = req.params;

	try {
		const experiences = await Experience.find({ userId }).sort({
			startDate: -1,
		});
		res.status(200).json(experiences);
	} catch (err) {
		console.log("Error in getting experience :", err);
		next(err);
	}
};

export const deleteExperience = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const { expId } = req.params;
	const userId = req.user?.userId;

	if (!mongoose.Types.ObjectId.isValid(expId)) {
		res.status(400).json({ message: "Invalid experience ID" });
		return;
	}

	try {
		const deleted = await Experience.findOneAndDelete({ _id: expId, userId });

		if (!deleted) {
			res
				.status(404)
				.json({ message: "Experience not found or not authorized" });
			return;
		}

		res.status(200).json({ message: "Experience deleted successfully" });
	} catch (err) {
		console.log("Error in deleting experience :", err);
		next(err);
	}
};

export const addOrUpdateExperience = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const data = sanitizeInput(req.body);

	// Validate Experience, if invalid throws error and that will be handled by errorMiddleware
	experienceSchema.parse(data);

	const userId = req.user?.userId;

	try {
		let saved;
		if (data._id && mongoose.Types.ObjectId.isValid(data._id)) {
			// Update existing experience
			const updated = await Experience.findByIdAndUpdate(
				data._id,
				{
					userId,
					title: data.title,
					company: data.company,
					companyId: data?.companyId || undefined,
					location: data?.location || "",
					locationType: data?.locationType || "onsite",
					startDate: data.startDate,
					endDate: data?.endDate || null,
					currentlyWorking: data?.currentlyWorking || false,
					description: data?.description || "",
				},
				{ new: true },
			);

			if (!updated) {
				res.status(404).json({ message: "Experience entry not found" });
				return;
			}

			saved = updated;
		} else {
			// Create new experience
			const newExperience = new Experience({
				userId,
				title: data.title,
				company: data.company,
				companyId: data?.companyId || undefined,
				location: data?.location || "",
				locationType: data?.locationType || "onsite",
				startDate: data.startDate,
				endDate: data?.endDate || null,
				currentlyWorking: data?.currentlyWorking || false,
				description: data?.description || "",
			});

			saved = await newExperience.save();
		}

		res.status(200).json(saved);
	} catch (err) {
		console.log("Error in adding/updating education :", err);
		next(err);
	}
};
