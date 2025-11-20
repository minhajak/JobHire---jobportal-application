import express from "express";
import {
	addOrUpdateEducation,
	addOrUpdateExperience,
	addUserLinks,
	deleteEducation,
	deleteExperience,
	deleteProfile,
	deleteResume,
	deleteUserLink,
	editUserLink,
	getCurrentUserProfile,
	getEducationByUser,
	getExperiencesByUser,
	getProfile,
	getResumeFile,
	getUserLinks,
	getUserResume,
	updateProfile,
	uploadResume,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload, pdfUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// Add/Update user profile
router.post("/", authMiddleware, imageUpload.single("image"), updateProfile);

// Get profile of a user
router.get("/:userId", getProfile);

router.get("/", authMiddleware, getCurrentUserProfile);

// Delete entire profile of a user ( Profile, Education, Experience , Resumes and links )
router.delete("/", authMiddleware, deleteProfile);

// Upload Resume
router.post(
	"/resume",
	authMiddleware,
	pdfUpload.single("resume"),
	uploadResume,
);

// get resume
router.get("/resume/:userId", getUserResume);

// fetch resume
router.get("/resume/file/:resId", getResumeFile);

router.delete("/resume/:resId", deleteResume);

// add link
router.post("/links", authMiddleware, addUserLinks);

router.get("/links/:userId", getUserLinks);

router.delete("/links/:linkId", authMiddleware, deleteUserLink);

router.put("/links/:linkId", authMiddleware, editUserLink);

// User Education Operations
router.get("/education/:userId", getEducationByUser);

router.delete("/education/:eduId", authMiddleware, deleteEducation);

router.post("/education", authMiddleware, addOrUpdateEducation);

// User Experience Operations
router.get("/experience/:userId", getExperiencesByUser);

router.delete("/experience/:expId", authMiddleware, deleteExperience);

router.post("/experience", authMiddleware, addOrUpdateExperience);

export default router;
