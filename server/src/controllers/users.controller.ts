import type { Request, Response } from "express";
import User from "../models/user.model";

export const getAllUser = async (req: Request, res: Response) => {
	try {
		const users = await User.find().select("email phone provider role");
		res.send(
			`users are ${users?.length > 0 ? users.map((user) => user) : "null"}`,
		);
	} catch (error) {
		res.send("Error in finding all users" + error);
	}
};
