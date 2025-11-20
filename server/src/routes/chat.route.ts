import { Router } from "express";
import {
	createConversation,
	getConversations,
	getMessages,
	uploadAudioHandler,
	uploadImageHandler,
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
	audioUpload,
	imageUpload,
	pdfUpload,
} from "../middlewares/cloudinary.middleware";

const router = Router();

// Create new conversation
router.post("/conversations", authMiddleware, createConversation);

// get all conversations
router.get("/conversations", authMiddleware, getConversations);

router.get("/:conversationId/messages", authMiddleware, getMessages);

router.post("/upload/image", imageUpload.single("file"), uploadImageHandler);

router.post("/upload/pdf", pdfUpload.single("file"), uploadImageHandler);

router.post("/upload/audio", audioUpload.single("file"), uploadAudioHandler);

export default router;
