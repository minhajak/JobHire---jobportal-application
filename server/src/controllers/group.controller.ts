import type { Request, Response } from "express";
import mongoose from "mongoose";
import Group from "../models/group.model";
import GroupRequest from "../models/group-request.model";
import { groupRequestStatus } from "../types/group.type";

export const createGroups = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		if (!userId) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const { name, description, category, image, isPrivate, tags } = req.body;

		// Basic validation
		if (!name || !description) {
			res.status(400).json({ message: "Name and description are required" });
			return;
		}
		const normalizedCategory =
			typeof category === "string" ? category.toLowerCase() : category;

		const imageUrl = (req.files as any)?.image?.[0]?.path || null;
		if (!imageUrl) {
			res.status(400).json({ message: "Group image is required" });
			console.log(image);
			return;
		}

		//Group.create automatically saves the document
		const group = await Group.create({
			name,
			description,
			image: imageUrl,
			category: normalizedCategory,
			isPrivate,
			admin: userId,
			members: [userId],
			tags,
		});

		// Respond with created group
		res.status(201).json({
			message: "Group created successfully",
			group,
		});
	} catch (error) {
		console.error("Error creating groups:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get user's groups (joined and recommendations)
export const getUserGroups = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const page = parseInt(req.query.page as string) || 1; // current page
		const limit = parseInt(req.query.limit as string) || 5; // items per page
		const skip = (page - 1) * limit;

		// Validate userId
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(400).json({ message: "Invalid user ID" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);

		// Get total count first
		const totalJoined = await Group.countDocuments({
			members: userObjectId,
		});

		// Fetch paginated joined groups
		const joinedGroups = await Group.find({
			members: userObjectId,
		})
			.skip(skip)
			.limit(limit)
			.populate("admin", "name email")
			.lean();

		// Format response
		const formattedJoinedGroups = joinedGroups.map((group) => ({
			id: group._id,
			name: group.name,
			image: group.image,
			memberCount: group.members?.length || 0,
			isJoined: true,
			admin: group.admin || { name: "Unknown", email: "" },
		}));

		res.json({
			joinedGroups: formattedJoinedGroups,
			pagination: {
				totalJoined,
				totalPages: Math.ceil(totalJoined / limit),
				currentPage: page,
				limit,
			},
		});
	} catch (error) {
		console.error("Error fetching user groups:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const joinGroup = async (req: Request, res: Response): Promise<void> => {
	try {
		const { groupId } = req.body;
		const userId = req.user?.userId;

		console.log("Join group request:", { groupId, userId });

		// Validate IDs
		if (
			!userId ||
			!mongoose.Types.ObjectId.isValid(groupId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			res.status(400).json({ message: "Invalid group ID or user ID" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);
		const groupObjectId = new mongoose.Types.ObjectId(groupId);

		// Find the group
		const group = await Group.findById(groupObjectId);
		if (!group) {
			res.status(404).json({ message: "Group not found" });
			return;
		}

		// Check if user is already a member (use equals for ObjectId safety)
		const isMember = group.members.some(
			(m: mongoose.Types.ObjectId | string) =>
				// handle both string and ObjectId
				m instanceof mongoose.Types.ObjectId
					? m.equals(userObjectId)
					: m.toString() === userObjectId.toString(),
		);

		if (isMember) {
			res
				.status(400)
				.json({ message: "User is already a member of this group" });
			return;
		}

		if (group.isPrivate) {
			// For private groups: create or update a join/follow request
			const existingRequest = await GroupRequest.findOne({
				requester: userObjectId,
				group: groupObjectId,
			});

			if (existingRequest) {
				switch (existingRequest.status) {
					case groupRequestStatus.PENDING:
						res
							.status(400)
							.json({ message: "Join request is already pending" });
						return;

					case groupRequestStatus.ACCEPTED:
						// Admin already accepted — add user to group (defensive)
						group.members.push(userObjectId);
						group.lastActivity =
							"New member joined (auto-added after request accepted)";
						await group.save();

						// ensure request has acceptedAt
						if (!existingRequest.acceptedAt) {
							existingRequest.acceptedAt = new Date();
							await existingRequest.save();
						}

						res.json({
							message: "Successfully joined group",
							group: {
								...group.toObject(),
								isJoined: true,
							},
						});
						return;

					case groupRequestStatus.REJECTED:
						// Re-submit the request by updating to PENDING (or you could create a new one)
						existingRequest.status = groupRequestStatus.PENDING;
						existingRequest.requestedAt = new Date();
						await existingRequest.save();

						console.log("Join request re-submitted:", { groupId, userId });

						res.status(200).json({
							message: "Join request re-submitted and is pending approval",
							request: existingRequest,
						});
						return;

					default:
						// Fallback: respond with created/updated request
						res.status(200).json({
							message: "Request status handled",
							request: existingRequest,
						});
						return;
				}
			} else {
				// create a new join request
				const newRequest = await GroupRequest.create({
					requester: userObjectId,
					group: groupObjectId,
					status: groupRequestStatus.PENDING,
					requestedAt: new Date(),
				});

				console.log("Join request created:", {
					groupId,
					userId,
					requestId: newRequest._id,
				});

				res.status(201).json({
					message: "Join request submitted and is pending approval",
					request: newRequest,
				});
				return;
			}
		} else {
			// Public group — add user to group members
			group.members.push(userObjectId);
			group.lastActivity = "New member joined";
			await group.save();

			console.log("User successfully joined group:", {
				groupId,
				userId,
				newMemberCount: Array.isArray(group.members)
					? group.members.length
					: undefined,
			});

			res.json({
				message: "Successfully joined group",
				group: {
					...group.toObject(),
					isJoined: true,
				},
			});
		}
	} catch (error) {
		console.error("Error joining group:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const acceptNewMember = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { groupRequestId } = req.body;

		// Basic validation
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ message: "Unauthorized: no valid user found" });
			return;
		}
		if (!groupRequestId || !mongoose.Types.ObjectId.isValid(groupRequestId)) {
			res.status(400).json({ message: "Invalid or missing groupRequestId" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);

		// Fetch the join request and populate group & requester for ease
		const request = await GroupRequest.findById(groupRequestId)
			.populate("group")
			.populate("requester");

		if (!request) {
			res.status(404).json({ message: "Group request not found" });
			return;
		}

		// Ensure group exists
		const groupId = (request.group as any)?._id || request.group;
		const group = await Group.findById(groupId);
		if (!group) {
			res.status(404).json({ message: "Group not found for this request" });
			return;
		}

		// Check whether the caller is an admin/owner for this group.
		// We check several common patterns: group.owner, group.admin, group.admins[]
		const isAdmin = (() => {
			const owner = (group as any).owner;
			if (owner) {
				if (owner instanceof mongoose.Types.ObjectId) {
					if (owner.equals(userObjectId)) return true;
				} else if (owner.toString() === userId) return true;
			}

			const adminSingle = (group as any).admin;
			if (adminSingle) {
				if (adminSingle instanceof mongoose.Types.ObjectId) {
					if (adminSingle.equals(userObjectId)) return true;
				} else if (adminSingle.toString() === userId) return true;
			}

			const admins = (group as any).admins;
			if (Array.isArray(admins)) {
				return admins.some((a: any) =>
					a instanceof mongoose.Types.ObjectId
						? a.equals(userObjectId)
						: a.toString() === userId,
				);
			}

			return false;
		})();

		if (!isAdmin) {
			res.status(403).json({
				message: "Forbidden: only group admin can accept new members",
			});
			return;
		}

		// Prevent duplicate acceptance
		if (request.status === groupRequestStatus.ACCEPTED) {
			res.status(400).json({ message: "Request already accepted" });
			return;
		}

		// Accept the request
		request.status = groupRequestStatus.ACCEPTED;
		request.acceptedAt = new Date();
		await request.save();

		// Add requester to group.members if not already present
		const requesterId =
			request.requester instanceof mongoose.Types.ObjectId
				? request.requester
				: (request.requester as any)?._id || request.requester;
		const requesterObjectId = new mongoose.Types.ObjectId(requesterId);

		const alreadyMember = Array.isArray(group.members)
			? group.members.some((m: any) =>
					m instanceof mongoose.Types.ObjectId
						? m.equals(requesterObjectId)
						: m.toString() === requesterObjectId.toString(),
				)
			: false;

		if (!alreadyMember) {
			group.members.push(requesterObjectId);
			group.lastActivity = `Member ${requesterObjectId.toString()} accepted`;
			// If you maintain memberCount separately, you can update it here:
			// (group as any).memberCount = (group.members || []).length;
			await group.save();
		}

		res.json({
			message: "Member accepted",
			request,
			group: group.toObject(),
		});
	} catch (error) {
		console.error("Error accepting new member to group:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getRequestedGroups = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = (req as any).user?.userId as string | undefined;

		// Reject if userId missing or not a valid ObjectId
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ message: "unauthorised" });
			return;
		}

		// find pending group requests for this user and populate group
		const groupRequests = await GroupRequest.find({
			requester: userId,
			status: groupRequestStatus.PENDING,
		})
			.populate("group")
			.lean();

		if (!groupRequests || groupRequests.length === 0) {
			res.status(200).json({ groups: [], requests: [] });
			return;
		}

		// extract group ids (handle populated group object or raw id)
		const groupIds = groupRequests
			.map((r: any) => {
				const g = r.group;
				if (!g) return null;
				// if populated, g might be an object with _id, else it's an id string/ObjectId
				return (g._id ?? g).toString();
			})
			.filter(Boolean);

		// deduplicate
		const uniqueIds = Array.from(new Set(groupIds)).map(
			(id) => new mongoose.Types.ObjectId(id),
		);

		// fetch groups
		const groups = await Group.find({ _id: { $in: uniqueIds } }).lean();

		// return both groups and the original requests (so front-end can map request id -> group)
		res.status(200).json({ groups });
	} catch (error: any) {
		console.error("getRequestedGroups error:", error);
		res.status(500).json({ message: "internal server error" });
	}
};

// Leave a group
export const leaveGroup = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { groupId } = req.params;
		const userId = req.user?.userId;

		console.log("Leave group request:", { groupId, userId });

		// Validate IDs
		if (
			!userId ||
			!mongoose.Types.ObjectId.isValid(groupId) ||
			!mongoose.Types.ObjectId.isValid(userId)
		) {
			res.status(400).json({ message: "Invalid group ID or user ID" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);
		const groupObjectId = new mongoose.Types.ObjectId(groupId);

		// Find the group
		const group = await Group.findById(groupObjectId);
		if (!group) {
			res.status(404).json({ message: "Group not found" });
			return;
		}

		// Check if user is a member
		if (!group.members.includes(userObjectId)) {
			res.status(400).json({ message: "User is not a member of this group" });
			return;
		}

		// Remove user from group members
		group.members = group.members.filter(
			(memberId) => !memberId.equals(userObjectId),
		);
		group.lastActivity = "Member left";
		await group.save();

		console.log("User successfully left group:", {
			groupId,
			userId,
			newMemberCount: group.memberCount,
		});

		res.json({
			message: "Successfully left group",
			group: {
				...group.toObject(),
				isJoined: false,
			},
		});
	} catch (error) {
		console.error("Error leaving group:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Search groups
export const searchGroups = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { query } = req.query;

		if (!userId) {
			res.status(401).json({ error: "unauthorised" });
			return;
		}
		if (!query) {
			res.status(400).json({ message: "Search query is required" });
			return;
		}

		const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null;

		// Search groups by name, description, category, or tags
		const searchRegex = new RegExp(query as string, "i");
		const groups = await Group.find({
			$or: [
				{ name: searchRegex },
				{ description: searchRegex },
				{ category: searchRegex },
				{ tags: { $in: [searchRegex] } },
			],
		})
			.populate("admin", "name email")
			.lean();

		// Add isJoined flag if userId provided
		const formattedGroups = groups.map((group) => ({
			...group,
			isJoined: userObjectId
				? group.members.some((memberId) => memberId.equals(userObjectId))
				: false,
			admin: group.admin || { name: "Unknown", email: "" },
		}));

		res.json({
			groups: formattedGroups,
			total: formattedGroups.length,
		});
	} catch (error) {
		console.error("Error searching groups:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get groups by category
export const getGroupsByCategory = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { category } = req.body;
		const userId = req.user?.userId;
		const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : null;

		const groups = await Group.find({ category })
			.populate("admin", "name email")
			.lean();

		// Add isJoined flag if userId provided
		const formattedGroups = groups.map((group) => ({
			...group,
			isJoined: userObjectId
				? group.members.some((memberId) => memberId.equals(userObjectId))
				: false,
			admin: group.admin || { name: "Unknown", email: "" },
		}));

		res.json({
			groups: formattedGroups,
			total: formattedGroups.length,
			category,
		});
	} catch (error) {
		console.error("Error fetching groups by category:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get group details
export const getGroupDetails = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { groupId } = req.body;
		const { userId } = req.query;

		if (!mongoose.Types.ObjectId.isValid(groupId)) {
			res.status(400).json({ message: "Invalid group ID" });
			return;
		}

		const userObjectId = userId
			? new mongoose.Types.ObjectId(userId as string)
			: null;

		const group = await Group.findById(groupId)
			.populate("admin", "name email")
			.populate("members", "name email")
			.lean();

		if (!group) {
			res.status(404).json({ message: "Group not found" });
			return;
		}

		const formattedGroup = {
			...group,
			isJoined: userObjectId
				? group.members.some((member: any) => member._id.equals(userObjectId))
				: false,
			admin: group.admin || { name: "Unknown", email: "" },
		};

		res.json({ group: formattedGroup });
	} catch (error) {
		console.error("Error fetching group details:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

/**
 * Recommend groups for the current user.
 * Strategy:
 *  - Exclude groups the user already belongs to / administers and groups the user has requested.
 *  - Score groups by number of shared tags with user's groups, then by shared category, then by memberCount.
 */
export const getGroupRecommendations = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			res.status(401).json({ message: "not authorised, try after login" });
			return;
		}

		const userObjectId = new mongoose.Types.ObjectId(userId);

		// 1) Get groups the user is part of (members or admin)
		const userGroups = await Group.find({
			$or: [{ members: userObjectId }, { admin: userObjectId }],
		})
			.select("_id tags category")
			.lean();

		const userGroupIds = userGroups.map((g) => g._id.toString());
		const userTags = Array.from(
			new Set(userGroups.flatMap((g) => (Array.isArray(g.tags) ? g.tags : []))),
		);
		const userCategories = Array.from(
			new Set(userGroups.map((g) => g.category).filter(Boolean)),
		);

		// 2) Get groups the user already requested (so we don't recommend them)
		const requests = await GroupRequest.find({ requester: userObjectId })
			.select("group status")
			.lean();
		const requestedGroupIds = requests
			.map((r) => (r.group ? r.group.toString() : null))
			.filter(Boolean) as string[];

		// 3) Build exclusion list (already in or already requested)
		const excludeSet = new Set<string>([...userGroupIds, ...requestedGroupIds]);

		// Create a match clause to exclude these groups
		const excludeIds = Array.from(excludeSet).map(
			(id) => new mongoose.Types.ObjectId(id),
		);

		// 4) If we have tags/categories, use aggregation to compute tag matches & category match,
		//    otherwise fallback to popular groups.
		let candidates: any[] = [];

		if (userTags.length > 0 || userCategories.length > 0) {
			candidates = await Group.aggregate([
				{
					$match: {
						_id: { $nin: excludeIds },
					},
				},
				{
					$addFields: {
						tagMatches: {
							$size: {
								$setIntersection: ["$tags", userTags],
							},
						},
						categoryMatch: {
							$cond: [{ $in: ["$category", userCategories] }, 1, 0],
						},
					},
				},
				{
					$sort: {
						tagMatches: -1,
						categoryMatch: -1,
						memberCount: -1,
						createdAt: -1,
					},
				},
				{ $limit: 2 },
				{
					$project: {
						name: 1,
						description: 1,
						image: 1,
						memberCount: 1,
						category: 1,
						tags: 1,
						lastActivity: 1,
						isPrivate: 1,
						tagMatches: 1,
						categoryMatch: 1,
					},
				},
			]);
		}

		// If aggregation didn't find enough (or we had no user tags/categories), fallback to popular groups
		if (!candidates || candidates.length === 0) {
			candidates = await Group.find({
				_id: { $nin: excludeIds },
			})
				.sort({ memberCount: -1, createdAt: -1 })
				.limit(3)
				.select(
					"name description image memberCount category tags lastActivity isPrivate",
				)
				.lean();
			// mark placeholders for tagMatches/categoryMatch = 0
			candidates = candidates.map((c) => ({
				...c,
				tagMatches: 0,
				categoryMatch: 0,
			}));
		}

		// 5) Transform to a clean response and include a short reason
		const recommendations = candidates.map((g: any) => {
			let reason = "Popular group";
			if (g.tagMatches && g.tagMatches > 0) {
				reason = `Shares ${g.tagMatches} tag${g.tagMatches > 1 ? "s" : ""}`;
			} else if (g.categoryMatch) {
				reason = "Same category";
			}

			return {
				id: g._id,
				name: g.name,
				isPrivate: g.isPrivate,
				description: g.description,
				image: g.image,
				memberCount: g.memberCount ?? 0,
				category: g.category,
				canJoin: !g.isPrivate, // public groups can be joined directly, private require request
				reason,
			};
		});

		res.status(200).json({ recommendations: recommendations });
	} catch (error) {
		console.error("getGroupRecommendations error:", error);
		res.status(500).json({ message: "internal server error" });
	}
};
