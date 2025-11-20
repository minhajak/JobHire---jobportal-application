import { Router } from "express";
import {
	commentOnCatchupUpdate,
	congratulateCatchupUpdate,
	getCatchupUpdates,
	likeCatchupUpdate,
} from "../controllers/catchup.controller";
import { deleteComment } from "../controllers/network-update.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Get catchup updates (with optional type filter)
router.get("/", authMiddleware, getCatchupUpdates);

// Like a catchup update
router.post("/:updateId/like", authMiddleware, likeCatchupUpdate);

// Comment on a catchup update
router.post("/:updateId/comment", authMiddleware, commentOnCatchupUpdate);

// Delete a comment from a catchup update
router.delete("/:updateId/comment/:commentId", authMiddleware, deleteComment);

// Congratulate on a catchup update
router.post(
	"/:updateId/congratulate",
	authMiddleware,
	congratulateCatchupUpdate,
);

export default router;
