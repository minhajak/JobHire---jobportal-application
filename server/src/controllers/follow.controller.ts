import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Follow } from "../models/follow.model";
import Profile from "../models/profile.model";

// Follow a user
export const followUser = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { followingId } = req.body;
		if (!userId) {
			res.status(401).json({ message: "unauthorised" });
			return;
		}
		if (
			!mongoose.Types.ObjectId.isValid(userId) ||
			!mongoose.Types.ObjectId.isValid(followingId)
		) {
			console.log("Invalid IDs:", userId, followingId);
			res.status(400).json({ error: "Invalid user IDs" });
			return;
		}

		// Check if already following
		const existingFollow = await Follow.findOne({
			followerId: userId,
			followingId,
		});
		if (existingFollow) {
			res.status(400).json({ error: "Already following this user" });
			return;
		}

		// Create new following relationship
		const following = new Follow({ followerId: userId, followingId });
		await following.save();

		console.log(`User ${userId} started following ${followingId}`);
		res.json({ success: true, message: "Successfully followed user" });
	} catch (error) {
		console.error("Error following user:", error);
		res.status(500).json({ error: "Failed to follow user" });
	}
};

// Unfollow a user
export const unfollowUser = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const followerId = req.user?.userId; // from middleware
		const followingId = req.params.id; // from params

		console.log(`followingId : ${followingId}`);
		if (!followingId) {
			res.status(400).json({ error: "Following Id is missing" });
			return;
		}
		if (!mongoose.Types.ObjectId.isValid(followingId as any)) {
			res.status(400).json({ error: "Invalid user IDs" });
			return;
		}

		const deleted = await Follow.findOneAndDelete({
			followerId: followerId,
			followingId: followingId,
		});

		if (!deleted) {
			res.status(404).json({ error: "Following relationship not found" });
			return;
		}

		res.json({ success: true, message: "Successfully unfollowed user" });
	} catch (error) {
		console.error("Error unfollowing user:", error);
		res.status(500).json({ error: "Failed to unfollow user" });
	}
};
// Get users that a specific user is following
export const getFollowing = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ error: "unauthorised" });
			return;
		}

		// Get following relationships (users that current user is following)
		const following = await Follow.find({ followerId: userId })
			.sort({ createdAt: -1 })
			.select("followingId")
			.lean();

		const followingIds = following.map((f) => f.followingId.toString());

		// Short-circuit when no follows
		if (followingIds.length === 0) {
			res.json({
				success: true,
				profiles: [],
				pagination: { totalProfiles: 0 },
			});
			return;
		}

		// Fetch profiles for those users
		const profiles = await Profile.find({
			userId: { $in: followingIds },
		})
			.select("userId fullName headline imageUrl")
			.lean();

		// Find which of those users follow the current user (i.e. follow-back)
		const followsBack = await Follow.find({
			followerId: { $in: followingIds },
			followingId: userId,
		})
			.select("followerId")
			.lean();

		const followingUsers = profiles.map((profile) => {
			const idStr = profile.userId.toString();
			return {
				userId: idStr,
				fullName: profile.fullName,
				headline: profile.headline,
				imageUrl: profile.imageUrl,
				isFollowingBack: true,
			};
		});

		res.json({
			success: true,
			profiles: followingUsers,
			pagination: { totalProfiles: followingUsers.length },
		});
	} catch (error) {
		console.error("Error getting following:", error);
		res.status(500).json({ error: "Failed to get following list" });
	}
};

export const getFollowers = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ error: "unauthorised" });
			return;
		}

		// Pagination (optional)
		const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
		const limit = Math.max(
			1,
			Math.min(100, parseInt(String(req.query.limit || "20"), 10)),
		);
		const skip = (page - 1) * limit;

		// Count total followers for pagination metadata
		const totalFollowers = await Follow.countDocuments({ followingId: userId });

		if (totalFollowers === 0) {
			res.json({
				success: true,
				profiles: [],
				pagination: {
					totalFollowers: 0,
					page,
					limit,
					totalPages: 0,
				},
			});
			return;
		}

		// Get follower relationships (users who follow current user)
		const followerDocs = await Follow.find({ followingId: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("followerId createdAt")
			.lean();

		const followerIds = followerDocs.map((d) => d.followerId.toString());

		// Fetch profiles for the follower users
		const profiles = await Profile.find({
			userId: { $in: followerIds },
		})
			.select("userId fullName headline imageUrl")
			.lean();

		// Check which of these users are followed back by the current user
		const followingBackDocs = await Follow.find({
			followerId: userId,
			followingId: { $in: followerIds },
		})
			.select("followingId")
			.lean();

		const followingBackSet = new Set(
			followingBackDocs.map((f) => f.followingId.toString()),
		);

		// Map profiles and preserve requested ordering by followerDocs order
		const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
		const followerUsers = followerIds.map((id) => {
			const profile = profileMap.get(id);
			return {
				userId: id,
				fullName: profile?.fullName ?? null,
				headline: profile?.headline ?? null,
				imageUrl: profile?.imageUrl ?? null,
				isFollowingBack: followingBackSet.has(id),
			};
		});

		res.json({
			success: true,
			profiles: followerUsers,
			pagination: {
				totalProfiles: totalFollowers,
			},
		});
	} catch (error) {
		console.error("Error getting followers:", error);
		res.status(500).json({ error: "Failed to get followers list" });
	}
};

export const getRecommendedFollows = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ message: "unauthorised" });
			return;
		}

		// 1️⃣ Get who the user already follows
		const followingDocs = await Follow.find({ followerId: userId })
			.select("followingId")
			.lean();

		const followingIds = followingDocs
			.map((d) => (d.followingId ? d.followingId.toString() : undefined))
			.filter(Boolean) as string[];

		const excludeIds = followingIds.map(
			(id) => new mongoose.Types.ObjectId(id),
		);

		// 2️⃣ Exclude the user themself too
		excludeIds.push(new mongoose.Types.ObjectId(userId));

		// 3️⃣ Fetch profiles not in excludeIds
		const profiles = await Profile.find({ userId: { $nin: excludeIds } })
			.select("userId fullName headline imageUrl")
			.limit(4)
			.lean();

		// 4️⃣ Map to clean response
		const updatedProfiles = profiles.map((profile) => ({
			userId: profile.userId,
			fullName: profile.fullName,
			headline: profile.headline,
			imageUrl: profile.imageUrl,
		}));

		res.status(200).json({ recommendations: updatedProfiles });
	} catch (error) {
		console.error("getRecommendedFollows error:", error);
		res.status(500).json({ message: "internal server error" });
	}
};
