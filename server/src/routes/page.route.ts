import express from "express";
import {
	createPage,
	deleteUserCreatedPages,
	getPage,
	getUserCreatedPages,
	updatePage,
} from "../controllers/page.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

router.post(
	"/",
	authMiddleware,
	imageUpload.fields([{ name: "logo", maxCount: 1 }]),
	createPage,
);
router.put(
	"/",
	authMiddleware,
	imageUpload.fields([{ name: "logo", maxCount: 1 }]),
	updatePage,
);
router.get("/", authMiddleware, getUserCreatedPages);

// Delete a specific page created by authenticated user
router.delete("/:pageId", authMiddleware, deleteUserCreatedPages);

router.get("/:pageId", authMiddleware, getPage);

// router.get("/recommendation",authMiddleware,getRecommendations)

export default router;
