import express from "express";
import { setUserRole } from "../controllers/role.controller";

const router = express.Router();

router.post("/", setUserRole);

export default router;
