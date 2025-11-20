import type { Request, Response } from "express";
import mongoose from "mongoose";
import Profile from "../models/profile.model";

/** escape user input for safe regex use */
function escapeRegex(s: string) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const searchProfiles = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { q, name, userId, page = "1", limit = "10" } = req.query;
		const code: string = (q as string).toLowerCase();

		// Convert page and limit to numbers
		const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
		const limitNum = Math.max(parseInt(limit as string, 10) || 10, 1);

		// Build filter object
		const filter: Record<string, any> = {};

		// Search term applied across multiple text fields
		// Supports ?mode=any (default) | startswith | initials
		if (code) {
			const qStr = (code as string).trim();
			const searchMode = "startswith";

			if (searchMode === "startswith") {
				// fullName starts with q (case-insensitive)
				const pattern = "^" + escapeRegex(qStr);
				filter.$or = [{ fullName: { $regex: pattern, $options: "i" } }];
			}
		}

		// Name filter (overrides fullName regex if provided)
		if (name) {
			filter.fullName = { $regex: name as string, $options: "i" };
		}

		// Optional userId filter (must be valid ObjectId)
		if (userId) {
			if (mongoose.Types.ObjectId.isValid(userId as string)) {
				filter.userId = userId;
			} else {
				res.status(400).json({ message: "Invalid userId" });
			}
		}

		// Query with pagination
		const profiles = await Profile.find(filter)
			.populate("userId", "fullName") // populate only userId with email & fullName
			.limit(limitNum)
			.lean();

		// Total count for pagination
		const total = await Profile.countDocuments(filter);

		res.json({
			profiles,
			pagination: {
				current: pageNum,
				pages: Math.ceil(total / limitNum),
				total,
				limit: limitNum,
			},
		});
	} catch (error) {
		console.error("Search error:", error);
		res.status(500).json({ message: "Error searching profiles" });
	}
};
