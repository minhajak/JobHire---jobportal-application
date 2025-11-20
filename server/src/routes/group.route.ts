import express from "express";
import {
	acceptNewMember,
	createGroups,
	getGroupDetails,
	getGroupRecommendations,
	getGroupsByCategory,
	getRequestedGroups,
	getUserGroups,
	joinGroup,
	leaveGroup,
	searchGroups,
} from "../controllers/group.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

//create group
router.post(
	"/",
	authMiddleware,
	imageUpload.fields([{ name: "image", maxCount: 1 }]),
	createGroups,
);

// Get user's groups (joined and recommendations)
router.get("/user", authMiddleware, getUserGroups);

// Join a group
router.post("/join", authMiddleware, joinGroup);

// accept new user only for private group
router.put("/accept", authMiddleware, acceptNewMember);

// requested groups
router.get("/requested", authMiddleware, getRequestedGroups);
// Leave a group
router.put("/leave/:groupId", authMiddleware, leaveGroup);

// Search groups
router.get("/search", authMiddleware, searchGroups);

// Get group details
router.get("/details", authMiddleware, getGroupDetails);

// Get groups by category
router.get("/category", authMiddleware, getGroupsByCategory);

// get group recommendations for user
router.get("/recommendations", authMiddleware, getGroupRecommendations);

export default router;
