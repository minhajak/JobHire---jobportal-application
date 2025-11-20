import express from "express";
import {
	followUser,
	getFollowers,
	getFollowing,
	getRecommendedFollows,
	unfollowUser,
} from "../controllers/follow.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Follow a user
router.post("/", authMiddleware, followUser);

// Unfollow a user
router.delete("/:id", authMiddleware, unfollowUser);

// Get users that a specific user is following
router.get("/following", authMiddleware, getFollowing);

// Get followers of a specific user
router.get("/followers", authMiddleware, getFollowers);

//get recommendations for user
router.get("/recommendations", authMiddleware, getRecommendedFollows);

export default router;
