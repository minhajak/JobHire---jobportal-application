import express from "express";
import {
	acceptConnection,
	getConnectionRequests,
	getPendingIvites,
	getUserConnections,
	rejectConnection,
	removeConnection,
	SuggestNewConnections,
	sendConnectionRequest,
} from "../controllers/connect.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/new-suggestions", authMiddleware, SuggestNewConnections);

router.post("/request", authMiddleware, sendConnectionRequest);

router.get("/my-requests", authMiddleware, getConnectionRequests);

router.patch("/accept/:connectionId", authMiddleware, acceptConnection);

router.patch("/reject/:connectionId", authMiddleware, rejectConnection);

router.get("/my-connections", authMiddleware, getUserConnections);

router.get("/pending-invites", authMiddleware, getPendingIvites);

router.delete("/remove/:connectionId", authMiddleware, removeConnection);

export default router;
