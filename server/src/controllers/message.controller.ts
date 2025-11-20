import type { NextFunction, Request, RequestHandler, Response } from "express";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

// Create a new conversation
export const createConversation: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const { participantId } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!participantId) {
      res.status(400).json({ error: "participantId is required" });
      return;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      isGroup: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId],
      });
    }

    const populatedConv = await Conversation.findById(
      conversation._id
    ).populate("participants", "email role");

    res.status(201).json(populatedConv);
  } catch (err) {
    res.status(500).json({ error: "Failed to create conversation", err });
  }
};

export const getConversations: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: No userId" });
      return;
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "email phone role")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "email role" },
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations", err });
  }
};

export const getMessages: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "email phone role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages", err });
  }
};

// upload image
export const uploadImageHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ mediaUrl: (req.file as any).path });
};

// Upload Audio
export const uploadAudioHandler = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: "No audio file uploaded" });
  }
  res.json({ mediaUrl: (req.file as any).path });
};
