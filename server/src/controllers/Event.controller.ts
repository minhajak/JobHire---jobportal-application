import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/event.model";
import type { IEvent } from "../types/event.type";
import { sanitizeInput } from "../utils/sanitize";
import { eventSchema } from "../validations/event.validations";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: "unauthorised" });
      return;
    }
    const modifiedUserId = new mongoose.Types.ObjectId(userId);

    const data: Partial<IEvent> = sanitizeInput(req.body);
    eventSchema.parse(data);

    const coverImageUrl: string =
      (req.files as any)?.coverImage?.[0]?.path || null;

    const event = new Event({
      creatorId: modifiedUserId,
      eventName: data.eventName,
      eventType: data.eventType,
      description: data.description,
      coverImageUrl: coverImageUrl,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      externalLink: data.externalLink,
      speakersId: data.speakersId,
      createdAt: new Date(),
      timeZone: data.timeZone,
    });
    await event.save();
    res.status(200).json({ message: "event created successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "internal server error", error: error });
  }
};

export const getUserCreatedEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: "unauthorised" });
      return;
    }
    const modifiedUserId = new mongoose.Types.ObjectId(userId);
    // Pagination: get page and limit from query params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // Fetch events with pagination
    const events = await Event.find({ creatorId: modifiedUserId })
      .sort({ createdAt: -1 }) // optional: newest first
      .skip(skip)
      .limit(limit)
      .lean();

    // Total count for frontend pagination
    const total = await Event.countDocuments({ creatorId: userId });

    res.status(200).json({
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

export const getEventDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { eventId } = req.params; 

    // Fixed: findById takes the ID directly, not an object
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    // Check if the user is the creator
    const isCreator = event.creatorId?.toString() === userId?.toString();

    res.status(200).json({
      event,
      isCreator,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
