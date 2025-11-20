// controllers/job.controller.ts
import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Company from "../models/company.model";
import Job, { type JobType } from "../models/job.model";
import type { CompanyType } from "../types/schema";
import { sanitizeInput } from "../utils/sanitize";
import {
	draftJobSchema,
	publishJobSchema,
} from "../validations/job.validation";

// controllers/job.controller.ts - Fixed file handling
export const createJob = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		console.log("=== CREATE JOB DEBUG ===");
		console.log("Request body:", req.body);
		console.log("Request files:", req.files);
		console.log("Request file (singular):", req.file);
		console.log("User ID:", userId);

		const data = sanitizeInput(req.body);

		// Set status to published since this is the publish endpoint
		data.status = "published";

		// Validate the incoming data for publishing
		const validationResult = publishJobSchema.safeParse(data);
		if (!validationResult.success) {
			console.log("Validation failed:", validationResult.error.issues);
			res.status(400).json({
				message: "Validation failed",
				errors: validationResult.error.issues,
			});
			return;
		}

		// Find or create company based on company name
		let company = await Company.findOne({
			name: data.companyName,
		});

		if (!company) {
			// Create a new company if it doesn't exist with the authenticated user as creator
			const companyData: Partial<CompanyType> = {
				name: data.companyName,
				about: data.aboutCompany || "",
				createdBy: userId,
			};
			company = new Company(companyData);
			await company.save();
		}

		// Handle file upload - FIXED
		let documentFile = null;

		// Check multiple ways files could be attached
		if (req.files) {
			console.log("Files object keys:", Object.keys(req.files));

			// Check if files is an array (single field)
			if (Array.isArray(req.files)) {
				documentFile = req.files[0];
				console.log("File from array:", documentFile);
			}
			// Check if files is an object with field names
			else if (typeof req.files === "object") {
				// Try 'document' field first
				if (
					(req.files as any).document &&
					Array.isArray((req.files as any).document)
				) {
					documentFile = (req.files as any).document[0];
					console.log("File from document field:", documentFile);
				}
				// Try first available field
				else {
					const firstKey = Object.keys(req.files)[0];
					if (firstKey && Array.isArray((req.files as any)[firstKey])) {
						documentFile = (req.files as any)[firstKey][0];
						console.log("File from first field:", firstKey, documentFile);
					}
				}
			}
		}

		// Also check req.file (single file upload)
		if (!documentFile && req.file) {
			documentFile = req.file;
			console.log("File from req.file:", documentFile);
		}

		console.log("Final document file:", documentFile);

		const jobData: Partial<JobType> = {
			jobTitle: data.jobTitle,
			company: company._id,
			companyName: company.name,
			aboutCompany: data.aboutCompany,
			workplaceType: data.workplaceType,
			jobLocation: data.jobLocation,
			jobType: data.jobType,
			jobDescription: data.jobDescription,
			requirements: data.requirements,
			documentTitle: data.documentTitle,
			privacyOption: data.privacyOption,
			selectedStyle: data.selectedStyle,
			status: "published",
			createdBy: userId,
		};

		// Add document file if exists
		if (documentFile) {
			console.log("Adding document file to job data:", {
				filename: documentFile.filename,
				originalName: documentFile.originalname,
				mimetype: documentFile.mimetype,
				size: documentFile.size,
				path: documentFile.path,
			});

			jobData.documentFile = {
				filename: documentFile.filename,
				originalName: documentFile.originalname,
				mimetype: documentFile.mimetype,
				size: documentFile.size,
				path: documentFile.path,
			};
		} else {
			console.log("No document file to add");
		}

		const job = new Job(jobData);
		await job.save();

		console.log("Job saved successfully with ID:", job._id);
		console.log("Job document file in DB:", job.documentFile);

		res.status(201).json({
			success: true,
			message: "Job posted successfully!",
			job: {
				_id: job._id,
				jobTitle: job.jobTitle,
				companyName: job.companyName,
				status: job.status,
				documentFile: job.documentFile, // Include this in response for debugging
				createdBy: userId,
				createdAt: job.createdAt,
			},
		});
	} catch (error) {
		console.error("Error in publishing job:", error);
		next(error);
	}
};

// controllers/job.controller.ts - Updated saveDraft with file support
export const saveDraft = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		console.log("=== SAVE DRAFT DEBUG ===");
		console.log("Request body:", req.body);
		console.log("Request files:", req.files);
		console.log("Request file (singular):", req.file);
		console.log("User ID:", userId);

		const data = sanitizeInput(req.body);

		// Ensure status is draft
		data.status = "draft";

		// Validate the incoming data for draft (more lenient)
		const validationResult = draftJobSchema.safeParse(data);
		if (!validationResult.success) {
			console.log("Draft validation failed:", validationResult.error.issues);
			res.status(400).json({
				message: "Validation failed",
				errors: validationResult.error.issues,
			});
			return;
		}

		let company = null;

		// Only create/find company if companyName is provided
		if (data.companyName) {
			company = await Company.findOne({
				name: data.companyName,
			});

			if (!company) {
				const companyData: Partial<CompanyType> = {
					name: data.companyName,
					about: data.aboutCompany || "",
					createdBy: userId,
				};
				company = new Company(companyData);
				await company.save();
			}
		}

		// Handle file upload - SAME LOGIC AS createJob
		let documentFile = null;

		// Check multiple ways files could be attached
		if (req.files) {
			console.log("Draft - Files object keys:", Object.keys(req.files));

			// Check if files is an array (single field)
			if (Array.isArray(req.files)) {
				documentFile = req.files[0];
				console.log("Draft - File from array:", documentFile);
			}
			// Check if files is an object with field names
			else if (typeof req.files === "object") {
				// Try 'document' field first
				if (
					(req.files as any).document &&
					Array.isArray((req.files as any).document)
				) {
					documentFile = (req.files as any).document[0];
					console.log("Draft - File from document field:", documentFile);
				}
				// Try first available field
				else {
					const firstKey = Object.keys(req.files)[0];
					if (firstKey && Array.isArray((req.files as any)[firstKey])) {
						documentFile = (req.files as any)[firstKey][0];
						console.log(
							"Draft - File from first field:",
							firstKey,
							documentFile,
						);
					}
				}
			}
		}

		// Also check req.file (single file upload)
		if (!documentFile && req.file) {
			documentFile = req.file;
			console.log("Draft - File from req.file:", documentFile);
		}

		console.log("Draft - Final document file:", documentFile);

		const jobData: Partial<JobType> = {
			jobTitle: data.jobTitle,
			companyName: data.companyName,
			aboutCompany: data.aboutCompany,
			workplaceType: data.workplaceType,
			jobLocation: data.jobLocation,
			jobType: data.jobType,
			jobDescription: data.jobDescription,
			requirements: data.requirements,
			documentTitle: data.documentTitle,
			privacyOption: data.privacyOption || "anyone",
			selectedStyle: data.selectedStyle || "manual",
			status: "draft",
			createdBy: userId,
		};

		// Add company reference if company exists
		if (company) {
			jobData.company = company._id;
		}

		// Add document file if exists - UPDATED
		if (documentFile) {
			console.log("Draft - Adding document file to job data:", {
				filename: documentFile.filename,
				originalName: documentFile.originalname,
				mimetype: documentFile.mimetype,
				size: documentFile.size,
				path: documentFile.path,
			});

			jobData.documentFile = {
				filename: documentFile.filename,
				originalName: documentFile.originalname,
				mimetype: documentFile.mimetype,
				size: documentFile.size,
				path: documentFile.path,
			};
		} else {
			console.log("Draft - No document file to add");
		}

		const job = new Job(jobData);
		await job.save();

		console.log("Draft saved successfully with ID:", job._id);
		console.log("Draft document file in DB:", job.documentFile);

		res.status(201).json({
			success: true,
			message: "Draft saved successfully!",
			job: {
				_id: job._id,
				jobTitle: job.jobTitle || "Untitled Draft",
				companyName: job.companyName || "No Company",
				status: job.status,
				documentFile: job.documentFile, // Include this in response for debugging
				createdBy: userId,
				createdAt: job.createdAt,
			},
		});
	} catch (error) {
		console.error("Error in saving draft:", error);
		next(error);
	}
};

export const getAllJobs = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const {
			page = 1,
			limit = 10,
			workplaceType,
			jobType,
			location,
			companyName,
		} = req.query;
		const skip = (Number(page) - 1) * Number(limit);

		const filter: any = { status: "published" };

		if (workplaceType) filter.workplaceType = workplaceType;
		if (jobType) filter.jobType = jobType;
		if (location) {
			filter.jobLocation = { $regex: location, $options: "i" };
		}
		if (companyName) {
			filter.companyName = { $regex: companyName, $options: "i" };
		}

		const jobs = await Job.find(filter)
			.populate("company", "name about industry logoUrl headquarters")
			.populate("createdBy", "email")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(Number(limit));

		const total = await Job.countDocuments(filter);

		res.status(200).json({
			success: true,
			data: jobs,
			pagination: {
				currentPage: Number(page),
				totalPages: Math.ceil(total / Number(limit)),
				totalJobs: total,
				hasNextPage: skip + jobs.length < total,
				hasPrevPage: Number(page) > 1,
			},
		});
	} catch (error) {
		console.error("Error in fetching jobs:", error);
		next(error);
	}
};

export const getJobById = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid job ID" });
			return;
		}

		const job = await Job.findById(id)
			.populate(
				"company",
				"name about industry website logoUrl headquarters locations",
			)
			.populate("createdBy", "email");

		if (!job) {
			res.status(404).json({ message: "Job not found" });
			return;
		}

		// Increment view count
		await Job.findByIdAndUpdate(id, { $inc: { views: 1 } });

		res.status(200).json({
			success: true,
			data: job,
		});
	} catch (error) {
		console.error("Error in fetching job:", error);
		next(error);
	}
};

export const updateJob = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { id } = req.params;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid job ID" });
			return;
		}

		const job = await Job.findById(id);
		if (!job) {
			res.status(404).json({ message: "Job not found" });
			return;
		}

		// Check if user owns the job
		if (!job.createdBy.equals(userId)) {
			res.status(403).json({ message: "Not authorized to update this job" });
			return;
		}

		const data = sanitizeInput(req.body);

		// Handle file upload
		let documentFile = null;

		// Check multiple ways files could be attached (same logic as create/draft)
		if (req.files) {
			if (Array.isArray(req.files)) {
				documentFile = req.files[0];
			} else if (typeof req.files === "object") {
				if (
					(req.files as any).document &&
					Array.isArray((req.files as any).document)
				) {
					documentFile = (req.files as any).document[0];
				} else {
					const firstKey = Object.keys(req.files)[0];
					if (firstKey && Array.isArray((req.files as any)[firstKey])) {
						documentFile = (req.files as any)[firstKey][0];
					}
				}
			}
		}

		if (!documentFile && req.file) {
			documentFile = req.file;
		}

		// Handle company creation/update if companyName is provided
		if (data.companyName) {
			let company = await Company.findOne({
				name: data.companyName,
			});

			if (!company) {
				const companyData: Partial<CompanyType> = {
					name: data.companyName,
					about: data.aboutCompany || "",
					createdBy: userId,
				};
				company = new Company(companyData);
				await company.save();
			}

			// Update job's company reference
			data.company = company._id;
		}

		// Update job fields - including status if provided
		Object.assign(job, data);

		// Handle document file update
		if (documentFile) {
			job.documentFile = {
				filename: documentFile.filename,
				originalName: documentFile.originalname,
				mimetype: documentFile.mimetype,
				size: documentFile.size,
				path: documentFile.path,
			};
		}

		// Set updatedAt timestamp
		job.updatedAt = new Date();

		await job.save();

		// Return appropriate success message based on status change
		let message = "Job updated successfully!";
		if (data.status === "published" && job.status === "published") {
			message = "Draft published successfully!";
		} else if (data.status === "draft") {
			message = "Job saved as draft!";
		}

		res.status(200).json({
			success: true,
			message: message,
			data: job,
		});
	} catch (error) {
		console.error("Error in updating job:", error);
		next(error);
	}
};

export const deleteJob = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { id } = req.params;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(id)) {
			res.status(400).json({ message: "Invalid job ID" });
			return;
		}

		const job = await Job.findById(id);
		if (!job) {
			res.status(404).json({ message: "Job not found" });
			return;
		}

		// Check if user owns the job
		if (!job.createdBy.equals(userId)) {
			res.status(403).json({ message: "Not authorized to delete this job" });
			return;
		}

		await Job.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Job deleted successfully!",
		});
	} catch (error) {
		console.error("Error in deleting job:", error);
		next(error);
	}
};

export const getJobStatusCounts = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		// Convert to ObjectId for proper matching
		const userObjectId = new mongoose.Types.ObjectId(userId);

		// Get counts for each status using aggregation for better performance
		const statusCounts = await Job.aggregate([
			{
				$match: {
					createdBy: userObjectId,
				},
			},
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		// Initialize counts
		let publishedCount = 0;
		let draftCount = 0;
		let totalCount = 0;

		// Process the aggregation results
		statusCounts.forEach((item) => {
			totalCount += item.count;
			if (item._id === "published") {
				publishedCount = item.count;
			} else if (item._id === "draft") {
				draftCount = item.count;
			}
		});

		const result = {
			all: totalCount,
			published: publishedCount,
			draft: draftCount,
		};

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (error) {
		console.error("Error in getJobStatusCounts:", error);
		next(error);
	}
};

// Updated getUserJobs method with better status filtering
export const getUserJobs = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		// Get pagination parameters
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const { status } = req.query;

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// IMPORTANT: Convert to ObjectId for proper matching
		const filter: any = {
			createdBy: new mongoose.Types.ObjectId(userId),
		};

		// Add status filter if specified
		if (status && (status === "draft" || status === "published")) {
			filter.status = status;
			console.log("Added status filter:", status);
		}

		const totalJobs = await Job.countDocuments(filter);

		// Fetch paginated jobs
		const jobs = await Job.find(filter)
			.populate("company", "name about industry logoUrl")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean()
			.exec();

		// Calculate pagination info
		const totalPages = Math.ceil(totalJobs / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		const pagination = {
			currentPage: page,
			totalPages: totalPages,
			totalJobs: totalJobs,
			hasNextPage: hasNextPage,
			hasPrevPage: hasPrevPage,
			itemsPerPage: limit,
		};

		// Add applicants count to each job
		const jobsWithApplicants = jobs.map((job) => ({
			...job,
			applicants: job.applications ? job.applications.length : 0,
		}));

		res.status(200).json({
			success: true,
			data: jobsWithApplicants,
			pagination: pagination,
		});
	} catch (error) {
		console.error("Error in fetching user jobs:", error);
		next(error);
	}
};

// Keep the getAllUserJobs method for "load all" functionality
export const getAllUserJobs = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "User not authenticated" });
			return;
		}

		const { status } = req.query;

		// IMPORTANT: Convert userId to ObjectId for proper matching
		const filter: any = {
			createdBy: new mongoose.Types.ObjectId(userId),
		};

		if (status && (status === "draft" || status === "published")) {
			filter.status = status;
		}

		// Use aggregation pipeline to ensure we get ALL results
		const jobsAggregation = await Job.aggregate([
			{ $match: filter },
			{
				$lookup: {
					from: "companies",
					localField: "company",
					foreignField: "_id",
					as: "company",
					pipeline: [
						{ $project: { name: 1, about: 1, industry: 1, logoUrl: 1 } },
					],
				},
			},
			{
				$addFields: {
					company: { $arrayElemAt: ["$company", 0] },
					applicants: { $size: { $ifNull: ["$applications", []] } },
				},
			},
			{ $sort: { createdAt: -1 } },
		]);

		const statusCounts = {
			total: jobsAggregation.length,
			published: jobsAggregation.filter((job) => job.status === "published")
				.length,
			draft: jobsAggregation.filter((job) => job.status === "draft").length,
		};

		res.status(200).json({
			success: true,
			data: jobsAggregation,
			totalJobs: jobsAggregation.length,
			statusBreakdown: statusCounts,
		});
	} catch (error) {
		console.error("Error in getAllUserJobs:", error);
		next(error);
	}
};
