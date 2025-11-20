// routes/job.route.ts - Updated with status counts endpoint
import express from "express";
import {
	createJob,
	deleteJob,
	getAllJobs,
	getAllUserJobs,
	getJobById,
	getJobStatusCounts, // NEW: Import the new method
	getUserJobs,
	saveDraft,
	updateJob,
} from "../controllers/job.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { pdfUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// PUBLIC ROUTES (no auth required)
router.get("/", getAllJobs);

// PROTECTED ROUTES (auth required) - More specific routes FIRST
router.get("/my-jobs/counts", authMiddleware, getJobStatusCounts); // NEW: Status counts endpoint
router.get("/my-jobs/all", authMiddleware, getAllUserJobs); // Load all jobs
router.get("/my-jobs", authMiddleware, getUserJobs); // Paginated jobs with optional status filter

// Draft route - supports file uploads
router.post(
	"/draft",
	authMiddleware,
	pdfUpload.fields([{ name: "document", maxCount: 1 }]),
	saveDraft,
);

// Create/publish job with file upload
router.post(
	"/",
	authMiddleware,
	pdfUpload.fields([{ name: "document", maxCount: 1 }]),
	createJob,
);

// Dynamic routes LAST (to avoid conflicts)
router.get("/:id", authMiddleware, getJobById);
router.put(
	"/:id",
	authMiddleware,
	pdfUpload.fields([{ name: "document", maxCount: 1 }]),
	updateJob,
);
router.delete("/:id", authMiddleware, deleteJob);

export default router;
