import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt-token";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const authHeader = req.headers.authorization;
	console.log(``)
	if (!authHeader)
		return res.status(401).json({ message: "Unauthorized: No token provided" });

	// Extract token from header
	const token = authHeader.split(" ")[1];

	if (!token) return res.status(401).json({ message: "Unauthorized" });

	// Verify JWT token
	const { role, userId } = verifyToken(token);

	if (!userId) return res.status(401).json({ message: "Unauthorized" });

	// Set data into the req
	(req as any).user = { role, userId };
	next();
};
