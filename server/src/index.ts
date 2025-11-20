import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import {
	authResetRoute,
	authRoute,
	CatchupRoute,
	chatRoute,
	companyRoute,
	connectRoute,
	eventRoute,
	FollowRoute,
	GroupRoute,
	jobRoute,
	NetworkUpdateRoute,
	pageRoute,
	profileRoute,
	roleRoute,
	searchRoute,
	usersRoute,
} from "./routes";
import { chatSocket } from "./socket/chat.socket";
import { getEnvVariable } from "./utils/helpers";

const CORS_URL = getEnvVariable("CORS_URL");

const app = express();
const PORT = process.env.PORT ?? 5000;

const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: CORS_URL, credentials: true },
});
app.set("io", io);

// Connect Database
connectDB();

// Middlewares
app.use(
	cors({
		origin: CORS_URL,
		credentials: true,
	}),
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get("/", async (_req, res) => {
	res.send("Hai there, API is running...");
});

// Routes
app.use("/api/auth", authRoute);

app.use("/api/reset", authResetRoute);

app.use(authMiddleware);

app.use("/api/companies", companyRoute);

app.use("/api/profile", profileRoute);

// Only for development purpose
app.use("/api/user", usersRoute);

app.use("/api/role", roleRoute);

app.use("/api/connect", connectRoute);

app.use("/api/search", searchRoute);

app.use("/api/jobs", jobRoute);

app.use("/api/chats", chatRoute);

app.use("/api/follow", FollowRoute);
// Network Updates routes (accessible without authentication for testing)
app.use("/api/network-updates", NetworkUpdateRoute);

app.use("/api/catchup", CatchupRoute);

// Groups routes (accessible without authentication for testing)
app.use("/api/groups", GroupRoute);

//events

app.use("/api/event", eventRoute);

// pages
app.use("/api/page", pageRoute);
// Error handler
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	chatSocket(io);
});
