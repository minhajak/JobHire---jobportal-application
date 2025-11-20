import dotenv from "dotenv";
import type { Response } from "express";

dotenv.config();

// Validate and get env variable
export const getEnvVariable = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		console.error(`Error: Environment variable '${name}' is not defined.`);
		process.exit(1);
	}
	return value;
};

export const catchError = (res: Response, error: unknown, name?: string) => {
	if (error instanceof Error) {
		console.log(`Error in ${name || "Unknown File"} : ${error.message}`);
	}
	return res.status(500).json({
		message: "Internal Server Error",
	});
};
