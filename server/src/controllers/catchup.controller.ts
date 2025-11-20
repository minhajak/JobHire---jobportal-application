import type { Request, Response } from "express";
import mongoose from "mongoose";
import { NetworkUpdate } from "../models/network-update.model";

// Get catchup updates (network updates from networkupdates collection)
export const getCatchupUpdates = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { type } = req.query;
		const userId = req.user?.userId;

		console.log("🔍 Catchup request - User ID:", userId);
		console.log("🔍 Request user object:", req.user);

		if (!userId) {
			console.log("❌ No user ID found in request");
			res.status(401).json({ error: "Authentication required" });
			return;
		}

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			console.log("❌ Invalid user ID format:", userId);
			res.status(400).json({ error: "Invalid user ID format" });
			return;
		}

		const db = mongoose.connection.db;
		if (!db) {
			throw new Error("Database connection not established yet");
		}

		// Check if NetworkUpdate collection exists
		const collectionExists = await db
			.listCollections({ name: "networkupdates" })
			.hasNext();
		console.log("NetworkUpdates collection exists:", collectionExists);

		// Build query filter based on type
		const filter: any = {};
		if (type && type !== "all") {
			filter.type = type;
		}

		// Get network updates from the networkupdates collection
		const updates = await NetworkUpdate.find(filter)
			.sort({ createdAt: -1 })
			.limit(50);

		console.log(`Found ${updates.length} catchup updates`);

		// Transform data to match frontend expectations
		const transformedUpdates = updates.map((update) => ({
			_id: update._id,
			userId: update.userId,
			content: update.content,
			type: update.type,
			likes: update.likes || [],
			comments: update.comments || [],
			congratulations: update.congratulations || [],
			createdAt: update.createdAt,
			updatedAt: update.updatedAt,
			fullName: update.fullName || "Unknown User",
			imageUrl:
				update.imageUrl ||
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
		}));

		console.log(`✅ Returning ${transformedUpdates.length} catchup updates`);
		res.json(transformedUpdates);
	} catch (error: any) {
		console.error("❌ Error fetching catchup updates:", error);
		res.status(500).json({
			error: "Failed to fetch catchup updates",
			message: error.message || "Unknown error",
		});
	}
};

// Like a catchup update
export const likeCatchupUpdate = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { updateId } = req.params;
		const userId = req.user?.userId;

		if (
			!userId ||
			!mongoose.Types.ObjectId.isValid(updateId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			console.log("Invalid IDs:", updateId, userId);
			res.status(400).json({ error: "Invalid IDs" });
			return;
		}

		const update = await NetworkUpdate.findById(updateId);
		if (!update) {
			console.log("Catchup update not found:", updateId);
			res.status(404).json({ error: "Catchup update not found" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);
		const isLiked = update.likes.some((like) => like.equals(userObjectId));

		if (isLiked) {
			// Unlike
			update.likes = update.likes.filter((like) => !like.equals(userObjectId));
		} else {
			// Like
			update.likes.push(userObjectId);
		}

		await update.save();
		console.log(`Updated likes for catchup update ${updateId}`);
		res.json({
			success: true,
			message: isLiked ? "Update unliked" : "Update liked",
			likesCount: update.likes.length,
			isLiked: !isLiked,
		});
	} catch (error) {
		console.error("Error liking catchup update:", error);
		res.status(500).json({ error: "Failed to like catchup update" });
	}
};

// Comment on a catchup update
export const commentOnCatchupUpdate = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { updateId } = req.params;
		const { content } = req.body;

		if (
			!userId ||
			!mongoose.Types.ObjectId.isValid(updateId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			console.log("Invalid IDs:", updateId, userId);
			res.status(400).json({ error: "Invalid IDs" });
			return;
		}

		if (!content || content.trim().length === 0) {
			console.log("Comment content is required");
			res.status(400).json({ error: "Comment content is required" });
			return;
		}

		const update = await NetworkUpdate.findById(updateId);
		if (!update) {
			console.log("Catchup update not found:", updateId);
			res.status(404).json({ error: "Catchup update not found" });
			return;
		}

		const newComment = {
			userId: new mongoose.Types.ObjectId(userId),
			content: content.trim(),
			createdAt: new Date(),
		};

		update.comments.push(newComment as any);
		await update.save();

		console.log(`Added comment to catchup update ${updateId}`);
		res.json({
			success: true,
			message: "Comment added successfully",
			commentsCount: update.comments.length,
		});
	} catch (error) {
		console.error("Error commenting on catchup update:", error);
		res.status(500).json({ error: "Failed to add comment" });
	}
};

// Congratulate on a catchup update
export const congratulateCatchupUpdate = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { updateId } = req.params;
		const userId = req.user?.userId;

		if (
			!userId ||
			!mongoose.Types.ObjectId.isValid(updateId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			console.log("Invalid IDs:", updateId, userId);
			res.status(400).json({ error: "Invalid IDs" });
			return;
		}

		const update = await NetworkUpdate.findById(updateId);
		if (!update) {
			console.log("Catchup update not found:", updateId);
			res.status(404).json({ error: "Catchup update not found" });
			return;
		}

		// Initialize congratulations field if it doesn't exist
		if (!update.congratulations) {
			update.congratulations = [];
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);
		const hasCongratulated = update.congratulations.some((congrat) =>
			congrat.equals(userObjectId),
		);

		if (hasCongratulated) {
			// Remove congratulation
			update.congratulations = update.congratulations.filter(
				(congrat) => !congrat.equals(userObjectId),
			);
		} else {
			// Add congratulation
			update.congratulations.push(userObjectId);
		}

		await update.save();
		console.log(`Updated congratulations for catchup update ${updateId}`);
		res.json({
			success: true,
			message: hasCongratulated
				? "Congratulation removed"
				: "Congratulation added",
			congratulationsCount: update.congratulations.length,
			hasCongratulated: !hasCongratulated,
		});
	} catch (error) {
		console.error("Error congratulating catchup update:", error);
		res.status(500).json({ error: "Failed to congratulate catchup update" });
	}
};
