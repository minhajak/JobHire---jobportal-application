import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { ZodError } from "zod";

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
): any => {
	// Zod validation error
	if (err instanceof ZodError) {
		res
			.status(400)
			.json({ message: err.errors[0]?.message || "Invalid input" });
		return;
	}

	console.error("Error message:", err.message);
	// Multer file upload error
	if (err instanceof MulterError) {
		res.status(400).json({ message: err.message });
		return;
	}

	// JWT-related error
	if (
		err instanceof Error &&
		(err.message === "jwt expired" || err.message === "invalid signature")
	) {
		res.status(401).json({ message: "Unauthorized: Invalid token" });
		return;
	}

	// Custom image file error
	if (err.message?.includes("Only image")) {
		res.status(400).json({ message: err.message });
		return;
	}

	// Generic fallback
	res.status(500).json({
		message: "Something went wrong!",
	});
	return;
};
