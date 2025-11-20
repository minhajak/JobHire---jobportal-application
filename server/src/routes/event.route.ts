import express from "express";
import {
	createEvent,
	getEventDetails,
	getUserCreatedEvents,
} from "../controllers/Event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// create a new event
router.post(
	"/",
	authMiddleware,
	imageUpload.fields([{ name: "coverImage", maxCount: 1 }]),
	createEvent,
);

// get all events created by a user
router.get("/user", authMiddleware, getUserCreatedEvents);


router.get("/:eventId",authMiddleware,getEventDetails)

export default router;
