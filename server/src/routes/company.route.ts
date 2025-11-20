import express from "express";
import {
	addSocialLinks,
	createCompany,
	deleteCompany,
	editCompany,
	getCompanyEmployees,
	updateSocialLink,
} from "../controllers/company.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from "../middlewares/cloudinary.middleware";

const router = express.Router();

// Create a company
router.post(
	"/",
	authMiddleware,
	imageUpload.fields([
		{ name: "logoImage", maxCount: 1 },
		{ name: "bannerImage", maxCount: 1 },
	]),
	createCompany,
);

// Edit an existing company
router.put(
	"/:id",
	authMiddleware,
	imageUpload.fields([
		{ name: "logoImage", maxCount: 1 },
		{ name: "bannerImage", maxCount: 1 },
	]),
	editCompany,
);

// Delete a company
router.delete("/:id", authMiddleware, deleteCompany);

// Get the employees of a company
router.get("/:id/employees", getCompanyEmployees);

// Add social links of a company
router.put("/:id/links", authMiddleware, addSocialLinks);

// Add update links of a company
router.put("/:id/links/:linkId", authMiddleware, updateSocialLink);

export default router;
