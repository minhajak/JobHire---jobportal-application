import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateBody =
	(schema: ZodSchema<any>) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (err: any) {
			const first = err?.issues?.[0];
			res
				.status(400)
				.json({ message: first?.message || "Invalid request payload" });
		}
	};
