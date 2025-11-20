import type { Request, Response } from "express";
import User from "../models/user.model";

export const setUserRole = async (
	req: Request,
	res: Response,
): Promise<any> => {
	try {
		const { role } = req.body;
		const userId = req.user?.userId;

		if (!userId || !role || !["JobSeeker", "Employer"].includes(role)) {
			return res.status(400).json({ message: "Invalid user ID or role" });
		}
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ role },
			{ new: true },
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "Role set successfully",
			user: {
				id: updatedUser._id,
				email: updatedUser?.email,
				phone: updatedUser?.phone,
				role: updatedUser.role,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};
