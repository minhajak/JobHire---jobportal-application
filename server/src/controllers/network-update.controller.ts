import type { Request, Response } from "express";
import { NetworkUpdate } from "../models/network-update.model";
import mongoose from "mongoose";

// Get network updates for a user's feed
export const getNetworkUpdates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.log(" Invalid user ID:", userId);
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established yet");
    }
    // Check if NetworkUpdate collection exists and has data
    const collectionExists = await db
      .listCollections({ name: "networkupdates" })
      .hasNext();
    console.log("NetworkUpdates collection exists:", collectionExists);

    const totalCount = await NetworkUpdate.countDocuments();
    console.log("Total NetworkUpdates in database:", totalCount);

    // Get all network updates without populate first to see raw data
    const updates = await NetworkUpdate.find({})
      .sort({ createdAt: -1 })
      .limit(50);

    console.log("Raw network updates from MongoDB:", updates.length, "found");
    console.log("Sample raw update:", updates[0] || "No updates found");

    // Transform data to match frontend expectations without user populate
    const transformedUpdates = updates.map((update) => ({
      _id: update._id,
      userId: update.userId,
      content: update.content,
      type: update.type,
      likes: update.likes,
      comments: update.comments,
      congratulations: update.congratulations || [],
      createdAt: update.createdAt,
      updatedAt: update.updatedAt,
      user: {
        _id: update.userId,
        name: update.fullName || "User Name",
        title: "Professional",
        company: "Company",
        avatar:
          update.imageUrl ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      message: update.content, // Add message field for compatibility
    }));

    console.log(`✅ Returning ${transformedUpdates.length} network updates`);
    console.log(
      "Sample transformed update:",
      transformedUpdates[0] || "No updates to transform"
    );

    res.json(transformedUpdates);
  } catch (error) {
    console.error(" Error fetching network updates:", error);
    res.status(500).json({
      error: "Failed to fetch network updates",
      details: error,
    });
  }
};

// Like a network update
export const likeNetworkUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { updateId } = req.params;
    const userId = req.user?.userId;

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(updateId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.log("Invalid IDs:", updateId, userId);
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    const update = await NetworkUpdate.findById(updateId);
    if (!update) {
      console.log("Network update not found:", updateId);
      res.status(404).json({ error: "Network update not found" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = update.likes.some((like) => like.equals(userObjectId));

    if (isLiked) {
      // Unlike
      update.likes = update.likes.filter((like) => !like.equals(userObjectId));
    } else {
      // Like
      update.likes.push(userObjectId);
    }

    await update.save();
    console.log(`Updated likes for network update ${updateId}`);
    res.json({
      success: true,
      message: isLiked ? "Update unliked" : "Update liked",
      likesCount: update.likes.length,
    });
  } catch (error) {
    console.error("Error liking network update:", error);
    res.status(500).json({ error: "Failed to like network update" });
  }
};

// Comment on a network update
export const commentOnNetworkUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { updateId } = req.params;
    const { content } = req.body;

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(updateId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.log("Invalid IDs:", updateId, userId);
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    if (!content || content.trim().length === 0) {
      console.log("Comment content is required");
      res.status(400).json({ error: "Comment content is required" });
      return;
    }

    const update = await NetworkUpdate.findById(updateId);
    if (!update) {
      console.log("Network update not found:", updateId);
      res.status(404).json({ error: "Network update not found" });
      return;
    }

    const newComment = {
      userId: new mongoose.Types.ObjectId(userId),
      content: content.trim(),
      createdAt: new Date(),
    };

    update.comments.push(newComment as any);
    await update.save();

    console.log(`Added comment to network update ${updateId}`);
    res.json({
      message: "Comment added successfully",
      commentsCount: update.comments.length,
    });
  } catch (error) {
    console.error("Error commenting on network update:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Congratulate on a network update
export const congratulateNetworkUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { updateId } = req.params;
    const userId = req.user?.userId;

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(updateId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.log("Invalid IDs:", updateId, userId);
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    const update = await NetworkUpdate.findById(updateId);
    if (!update) {
      console.log("Network update not found:", updateId);
      res.status(404).json({ error: "Network update not found" });
      return;
    }

    // Initialize congratulations field if it doesn't exist
    if (!update.congratulations) {
      update.congratulations = [];
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasCongratulated = update.congratulations.some((congrat) =>
      congrat.equals(userObjectId)
    );

    if (hasCongratulated) {
      // Remove congratulation
      update.congratulations = update.congratulations.filter(
        (congrat) => !congrat.equals(userObjectId)
      );
    } else {
      // Add congratulation
      update.congratulations.push(userObjectId);
    }

    await update.save();
    console.log(`Updated congratulations for network update ${updateId}`);
    res.json({
      success: true,
      message: hasCongratulated
        ? "Congratulation removed"
        : "Congratulation added",
      congratulationsCount: update.congratulations.length,
    });
  } catch (error) {
    console.error("Error congratulating network update:", error);
    res.status(500).json({ error: "Failed to congratulate network update" });
  }
};
// Delete a comment from a network update
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { updateId, commentId } = req.params;
    const userId = req.user?.userId;

    console.log("=== Delete Comment API Called ===");
    console.log("Update ID:", updateId);
    console.log("Comment ID:", commentId);
    console.log("User ID:", userId);

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(updateId) ||
      !mongoose.Types.ObjectId.isValid(commentId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.log("Invalid IDs:", updateId, commentId, userId);
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    const update = await NetworkUpdate.findById(updateId);
    if (!update) {
      console.log("Network update not found:", updateId);
      res.status(404).json({ error: "Network update not found" });
      return;
    }

    // Find the comment to delete
    const commentIndex = update.comments.findIndex(
      (comment) => comment._id && comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      console.log("Comment not found:", commentId);
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    const comment = update.comments[commentIndex];

    // Check if the user owns the comment
    if (comment.userId.toString() !== userId.toString()) {
      console.log("Unauthorized: User does not own this comment");
      res
        .status(403)
        .json({ error: "Unauthorized: You can only delete your own comments" });
      return;
    }

    // Remove the comment
    update.comments.splice(commentIndex, 1);
    await update.save();

    console.log(`Deleted comment ${commentId} from network update ${updateId}`);
    res.json({
      success: true,
      message: "Comment deleted successfully",
      commentsCount: update.comments.length,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment", details: error });
  }
};
