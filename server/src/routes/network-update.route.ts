import { Router } from "express";
import {
	commentOnNetworkUpdate,
	congratulateNetworkUpdate,
	deleteComment,
	getNetworkUpdates,
	likeNetworkUpdate,
} from "../controllers/network-update.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Get network updates for a user's feed
router.get("/", authMiddleware, getNetworkUpdates);

// Like a network update
router.post("/:updateId/like", authMiddleware, likeNetworkUpdate);

// Comment on a network update
router.post("/:updateId/comment", authMiddleware, commentOnNetworkUpdate);

// Delete a comment from a network update
router.delete("/:updateId/comment/:commentId", authMiddleware, deleteComment);

// Congratulate on a network update
router.post(
	"/:updateId/congratulate",
	authMiddleware,
	congratulateNetworkUpdate,
);

export default router;
