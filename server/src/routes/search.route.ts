import express from "express";
import { searchProfiles } from "../controllers/search.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, searchProfiles);

export default router;
