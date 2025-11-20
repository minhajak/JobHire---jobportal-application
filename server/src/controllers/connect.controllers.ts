// controllers/connectController.ts
import type { Request, Response } from "express";
import mongoose from "mongoose";

import Connect from "../models/connect.model";
import Profile from "../models/profile.model";
import { ConnectionStatus } from "../types/enum";
import { sanitizeInput } from "../utils/sanitize";

export const SuggestNewConnections = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;

		if (!userId) {
			res.status(401).json({ message: "unauthorized" });
			return;
		}

		const currentUserId = new mongoose.Types.ObjectId(userId);

		// 1. Find all connections involving this user
		const connections = await Connect.find({
			$or: [{ requester: currentUserId }, { recipient: currentUserId }],
		});

		// 2. Collect all userIds already connected/pending/rejected
		const excludedIds = new Set<string>();
		excludedIds.add(currentUserId.toString());

		connections.forEach((c) => {
			excludedIds.add(c.requester.toString());
			excludedIds.add(c.recipient.toString());
		});

		// 3. Find profiles excluding those IDs
		const suggestions = await Profile.find({
			userId: {
				$nin: Array.from(excludedIds).map(
					(id) => new mongoose.Types.ObjectId(id),
				),
			},
		})
			.select("userId fullName imageUrl headline")
			.limit(6);

		res.status(200).json({
			suggestions,
		});
	} catch (error) {
		console.error("Error in SuggestNewConnections:", error);
		res.status(500).json({ message: "Server error", error });
	}
};

export const sendConnectionRequest = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		console.log("DEBUGG...1");
		const userId = req.user?.userId; // From authentication middleware
		const { targetUserId } = sanitizeInput(req.body);
		if (!targetUserId) {
			res.status(400).json("bad request");
		}

		if (userId === targetUserId) {
			res.status(400).json({ message: "Cannot connect with yourself" });
			return;
		}

		// Check if connection already exists
		const existingConnection = await Connect.findOne({
			$or: [
				{ requester: userId, recipient: targetUserId },
				{ requester: targetUserId, recipient: userId },
			],
		});

		if (existingConnection) {
			res.status(400).json({ message: "Connection already exists" });
			return;
		}

		const connection = new Connect({
			requester: userId,
			recipient: targetUserId,
			status: ConnectionStatus.PENDING,
		});
		console.log("DEBUGG...2");

		await connection.save();
		console.log("DEBUGG...3");

		res.status(201).json({
			message: "Connection request sent successfully",
			connection,
		});
		console.log("DEBUGG...4");
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server error", error });
	}
};

export const getConnectionRequests = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId; // From authentication middleware

		if (!userId) {
			res.status(401).json({
				message: "Unauthorized Entry",
			});
			return;
		}

		// Find pending requests where the current user is the initiator (userB)
		const pendingRequests = await Connect.find({
			requester: userId, // userA is the initiator
			status: ConnectionStatus.PENDING,
		})
			.sort({ requestedAt: -1 })
			.limit(Number(10));

		// Extract all reciever's user IDs (userA)
		const recieverIds = pendingRequests.map((conn) => conn.recipient);

		// Get profiles for all recievers
		const profiles = await Profile.find({
			userId: { $in: recieverIds },
		}).select("userId fullName headline imageUrl");

		// Create a map for quick lookup
		const profileMap = new Map();
		profiles.forEach((profile) => {
			profileMap.set(profile.userId.toString(), profile);
		});

		// Format the response to include profile info
		const formattedRequests = pendingRequests.map((conn) => {
			const recieversId = conn.recipient.toString();
			const profile = profileMap.get(recieversId);

			return {
				_id: conn._id,
				user: {
					userId: recieversId,
					fullName: profile?.fullName ?? "",
					headline: profile?.headline ?? "",
					imageUrl: profile?.imageUrl ?? "",
				},
				requestedAt: conn.requestedAt,
			};
		});

		const total = await Connect.countDocuments({
			requester: userId,
			status: ConnectionStatus.PENDING,
		});

		res.json({
			requests: formattedRequests,
			totalRequests: total,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Accept connection request
export const acceptConnection = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId; // From authentication middleware
		const { connectionId } = req.params;

		const connection = await Connect.findOne({
			_id: connectionId,
			recipient: userId, // Ensure the current user is the recipient
			status: ConnectionStatus.PENDING,
		});

		if (!connection) {
			res.status(404).json({ message: "Connection request not found" });
			return;
		}

		connection.status = ConnectionStatus.ACCEPTED;
		connection.acceptedAt = new Date();
		await connection.save();

		res.json({ message: "Connection accepted", connection });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Reject connection request
export const rejectConnection = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId; // From authentication middleware
		const { connectionId } = req.params;

		const connection = await Connect.findOne({
			_id: connectionId,
			recipient: userId,
			status: ConnectionStatus.PENDING,
		});

		if (!connection) {
			res.status(404).json({ message: "Connection request not found" });
			return;
		}

		connection.status = ConnectionStatus.REJECTED;
		await connection.save();

		res.json({ message: "Connection rejected" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Get all connections for a user
export const getUserConnections = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId; // From authentication middleware

		if (!userId) {
			res.status(401).json({
				message: "Unauthorized Entry",
			});
			return;
		}

		const connections = await Connect.find({
			$or: [{ requester: userId }, { recipient: userId }],
			status: ConnectionStatus.ACCEPTED,
		})
			.sort({ requestedAt: -1 })
			.limit(10);

		// Extract all user IDs from connections
		const connectedUserIds = connections.map((conn) =>
			conn.requester === userId ? conn.recipient : conn.requester,
		);

		// Get profiles for all connected users
		const profiles = await Profile.find({
			userId: { $in: connectedUserIds },
		}).select("userId fullName headline imageUrl");

		// Create a map for quick lookup
		const profileMap = new Map();
		profiles.forEach((profile) => {
			profileMap.set(profile.userId.toString(), profile);
		});

		// Format the response to show the other user's details from Profile
		const formattedConnections = connections.map((conn) => {
			const isRequester = conn.requester === userId;
			const otherUserId = isRequester
				? conn.recipient.toString()
				: conn.requester.toString();
			const profile = profileMap.get(otherUserId);

			return {
				_id: conn._id,
				user: {
					userId: otherUserId,
					fullName: profile?.fullName || "",
					headline: profile?.headline || "",
					imageUrl: profile?.imageUrl ?? "",
				},
				connectedSince: conn.acceptedAt || conn.requestedAt,
			};
		});

		const total = await Connect.countDocuments({
			$or: [{ requester: userId }, { recipient: userId }],
			status: ConnectionStatus.ACCEPTED,
		});

		res.json({
			connections: formattedConnections,
			totalConnections: total,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Get all pending connection requests for a user
export const getPendingIvites = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId; // From authentication middleware

		if (!userId) {
			res.status(401).json({
				message: "Unauthorized Entry",
			});
			return;
		}

		// Find pending connections where the current user is the recipient (userB)
		const pendingConnections = await Connect.find({
			recipient: userId, // userB is the one receiving the request
			status: ConnectionStatus.PENDING,
		})
			.sort({ requestedAt: -1 })
			.limit(Number(10));

		// Extract all requester user IDs (userA)
		const requesterIds = pendingConnections.map((conn) => conn.requester);

		// Get profiles for all requesters
		const profiles = await Profile.find({
			userId: { $in: requesterIds },
		}).select("userId fullName headline imageUrl");

		// Create a map for quick lookup
		const profileMap = new Map();
		profiles.forEach((profile) => {
			profileMap.set(profile.userId.toString(), profile);
		});

		// Format the response to include profile info
		const formattedRequests = pendingConnections.map((conn) => {
			const requesterId = conn.requester.toString();
			const profile = profileMap.get(requesterId);

			return {
				_id: conn._id,
				user: {
					userId: requesterId,
					fullName: profile?.fullName || "",
					headline: profile?.headline || "",
					imageUrl: profile?.imageUrl || "",
				},
				requestedAt: conn.requestedAt,
			};
		});

		const total = await Connect.countDocuments({
			recipient: userId,
			status: ConnectionStatus.PENDING,
		});

		res.json({
			invites: formattedRequests,
			totalIvites: total,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Remove connection
export const removeConnection = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const userId = req.user?.userId;
		const { connectionId } = req.params;

		const connection = await Connect.findOne({
			_id: connectionId,
			$or: [{ requester: userId }, { recipient: userId }],
			status: ConnectionStatus.PENDING,
		});

		if (!connection) {
			res.status(404).json({ message: "Connection not found" });
			return;
		}

		await Connect.findByIdAndDelete(connectionId);

		res.json({ message: "Connection removed successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

// Check connection status with another user
export const checkConnectionStatus = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { userId } = req.body;
		const { targetUserId } = req.params;

		const connection = await Connect.findOne({
			$or: [
				{ requester: userId, recipient: targetUserId },
				{ requester: targetUserId, recipient: userId },
			],
		});

		if (!connection) {
			res.json({ status: "not_connected" });
			return;
		}

		res.json({
			status: connection.status,
			initiator: connection.requester.toString() === userId ? "you" : "them",
			requestedAt: connection.requestedAt,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
