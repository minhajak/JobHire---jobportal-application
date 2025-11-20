import jwt from "jsonwebtoken";
import type { Server, Socket } from "socket.io";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

interface DecodedUser {
	userId?: string;
	id?: string;
	email?: string;
	role?: string;
}

export const chatSocket = (io: Server) => {
	//Authenticate user before connection

	io.use((socket, next) => {
		const token = socket.handshake.auth?.token;
		if (!token) return next(new Error("No token provided"));
		try {
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET as string,
			) as DecodedUser;

			(socket as any).user = {
				userId: (decoded.userId || decoded.id) as string,
				email: decoded.email,
				role: decoded.role,
			};
			return next();
		} catch (err) {
			return next(new Error("Invalid token"));
		}
	});

	io.on("connection", (socket: Socket) => {
		const user = (socket as any).user;
		console.log(`User connected: ${user.userId}(${socket.id})`);

		socket.on("joinRoom", (conversationId: string) => {
			if (!conversationId) return;
			socket.join(conversationId);
			console.log(`User ${user.userId} joined room ${conversationId}`);
		});

		// Send message

		socket.on("sendMessage", async (data, callback) => {
			console.log(" sendMessage called by:", user.userId, "data:", data);
			try {
				const { conversationId, content, type, mediaUrl, location, contact } =
					data;
				const senderId = user.userId;

				const conversation = await Conversation.findById(conversationId);
				if (!conversation) {
					const err = { error: "Conversation not found" };
					if (callback) return callback(err);
					return socket.emit("error", err);
				}

				if (
					!conversation.participants.some((p: any) => p.toString() === senderId)
				) {
					const err = { error: "You are not a participant" };
					if (callback) return callback(err);
					return socket.emit("errorMessage", err);
				}

				const message = await Message.create({
					conversation: conversationId,
					sender: senderId,
					type: type === "camera" ? "image" : type,
					content: type === "text" ? content : "",
					mediaUrl: type !== "text" ? mediaUrl : null,
					location: type === "location" ? location : null,
					contact,
					fileName: data.fileName,
				});

				await Conversation.findByIdAndUpdate(conversationId, {
					lastMessage: message._id,
					updatedAt: new Date(),
				});

				await message.populate("sender", "email role");

				socket.to(conversationId).emit("receiveMessage", message);
				if (callback) callback({ success: true, message });
			} catch (error) {
				console.error("sendMessage socket error:", error);
				const err = { error: "Failed to send message" };
				if (callback) return callback(err);
				return socket.emit("error", err);
			}
		});

		// clear chat
		socket.on("clearChat", async (conversationId: string, callback) => {
			try {
				const userId = user.userId;

				const conversation = await Conversation.findById(conversationId);
				if (!conversation)
					return callback?.({ error: "Conversation not found" });

				if (
					!conversation.participants.some((p: any) => p.toString() === userId)
				) {
					return callback?.({ error: "Not authorized" });
				}

				await Message.deleteMany({ conversation: conversationId });

				conversation.lastMessage = null;
				await conversation.save();

				io.to(conversationId).emit("chatCleared", { conversationId });

				callback?.({ success: true });
			} catch (err) {
				console.error("clearChat socket error:", err);
				callback?.({ error: "Failed to clear chat" });
			}
		});

		socket.on("typing", ({ conversationId, userId }) => {
			socket.to(conversationId).emit("typing", { userId });
		});
		socket.on("stopTyping", ({ conversationId, userId }) => {
			socket.to(conversationId).emit("stopTyping", { userId });
		});
		socket.on("disconnect", () => {
			console.log("User disconnected:", socket.id);
		});
	});
};
