import type { Request, Response } from "express";
import mongoose from "mongoose";
import Page from "../models/page.model";
import type { Ipage } from "../types/page.type";
import { sanitizeInput } from "../utils/sanitize";
import { pageSchema } from "../validations/page.validation";

export const createPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const data: Partial<Ipage> = sanitizeInput(req.body);
    pageSchema.parse(data);
    const file = req.files as any;
    const logoUrl = file?.logo?.[0]?.path || null;

    const page = await Page.create({
      creatorId: userId,
      name: data.name,
      website: data.website,
      industry: data.industry,
      organisationSize: data.organisationSize,
      organisationType: data.organisationType,
      logo: logoUrl,
      tagline: data.tagline,
      createdAt: new Date(),
    });
    res.status(200).json({ message: "page created successfully", page: page });
  } catch (error) {
    res.status(500).json({ message: "internal server errror", error: error });
  }
};

export const getUserCreatedPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    userId = new mongoose.Types.ObjectId(userId);

    // Get total count and pages in parallel
    const [totalPages, pages] = await Promise.all([
      Page.countDocuments({ creatorId: userId }),
      Page.find({ creatorId: userId })
        .sort({ createdAt: -1 }) // Most recent first
        .skip(skip)
        .limit(limit)
        .select("-__v") // Exclude version key
        .lean(), // Return plain JavaScript objects for better performance
    ]);

    const totalPagesCount = Math.ceil(totalPages / limit);
    const hasNextPage = page < totalPagesCount;
    const hasPrevPage = page > 1;

    res.status(200).json({
      pages: pages,
      pagination: {
        currentPage: page,
        totalPages: totalPagesCount,
        totalItems: totalPages,
        limit: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching user pages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteUserCreatedPages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let userId = req.user?.userId;
    const { pageId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Validate pageId format
    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      res.status(400).json({
        success: false,
        message: "Invalid page ID format",
      });
      return;
    }

    userId = new mongoose.Types.ObjectId(userId);

    // Find the page
    const page = await Page.findById(pageId).lean();

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found",
      });
      return;
    }

    // Check if the user is the creator of the page
    if (page.creatorId.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this page",
      });
      return;
    }

    // Delete the page
    await Page.findByIdAndDelete(pageId);

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const getPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pageId)) {
      res.status(400).json({
        success: false,
        message: "Invalid page ID format",
      });
      return;
    }

    // Find the page and populate creator info
    const page = await Page.findById(pageId).select("-__v").lean();

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Page not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updatePage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const data: Partial<Ipage> = sanitizeInput(req.body);
    pageSchema.parse(data);

    // Find the existing page
    const existingPage = await Page.findOne({ _id: data.id });

    if (!existingPage) {
      res.status(404).json({ message: "Page not found" });
      return;
    }

    // Verify ownership
    if (existingPage.creatorId.toString() !== userId.toString()) {
      res.status(403).json({ message: "Not authorized to update this page" });
      return;
    }

    // Get logo URL or keep existing
    const logoUrl = (req.files as any)?.logo?.[0]?.path;

    // Update fields
    existingPage.name = data.name ?? existingPage.name;
    existingPage.website = data.website ?? existingPage.website;
    existingPage.industry = data.industry ?? existingPage.industry;
    existingPage.organisationSize =
      data.organisationSize ?? existingPage.organisationSize;
    existingPage.organisationType =
      data.organisationType ?? existingPage.organisationType;
    existingPage.logo = logoUrl ?? existingPage.logo;
    existingPage.tagline = data.tagline ?? existingPage.tagline;
    existingPage.updatedAt = new Date();

    const modifiedPage = await existingPage.save();

    res.status(200).json({
      message: "Page updated successfully",
      page: modifiedPage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};
