import type { NextFunction, Request, Response } from "express";
import Company from "../models/company.model";
import Employee from "../models/employee.model";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import type { CompanyType } from "../types/schema";
import { compareHashedPassword } from "../utils/hash";
import { sanitizeInput } from "../utils/sanitize";
import { companySchema } from "../validations/company.validation";
import { linkSchema } from "../validations/profile.validation";

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: Partial<CompanyType> = sanitizeInput(req.body);

    companySchema.parse(data);

    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: "User not found. Please log in again." });
      return;
    }

    // Only create company if the user role is Employer
    if (user.role !== "Employer") {
      res
        .status(403)
        .json({ message: "Access denied. This action is only for employers." });
      return;
    }
    // Extract uploaded image URLs
    const logoUrl = (req.files as any)?.logoImage?.[0]?.path || null;
    const bannerUrl = (req.files as any)?.bannerImage?.[0]?.path || null;

    const company = new Company({
      name: data.name,
      createdBy: user._id,
      industry: data.industry,
      specialties: data.specialties,
      estYear: data.estYear,
      size: data.size,
      type: data.type,
      about: data.about,
      website: data.website,
      email: data.email,
      logoUrl,
      phone: data.phone,
      bannerUrl,
      headquarters: data.headquarters,
      locations: data.locations,
    });

    await company.save();

    res.status(200).json({ message: "Company created successfully!", company });
  } catch (error) {
    console.error("Error in creating a company:", error);
    next(error);
  }
};

export const editCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.params.id;
    const userId = req.user?.userId;

    if (!companyId) {
      res.status(401).json({ message: "Invalid company id required." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(401).json({ message: "User not found. Please log in again." });
      return;
    }

    if (user.role !== "Employer") {
      res
        .status(403)
        .json({ message: "Access denied. Only employers can edit companies." });
      return;
    }

    const data: Partial<CompanyType> = sanitizeInput(req.body);

    companySchema.partial().parse(data);

    const company = await Company.findOne({
      _id: companyId,
      createdBy: userId,
    });
    if (!company) {
      res.status(404).json({
        message: "Company not found or you are not authorized to edit it.",
      });
      return;
    }

    const logoUrl = (req.files as any)?.logoImage?.[0]?.path;
    const bannerUrl = (req.files as any)?.bannerImage?.[0]?.path;

    company.name = data.name ?? company.name;
    company.industry = data.industry ?? company.industry;
    company.specialties = data.specialties ?? company.specialties;
    company.estYear = data.estYear ?? company.estYear;
    company.size = data.size ?? company.size;
    company.type = data.type ?? company.type;
    company.about = data.about ?? company.about;
    company.website = data.website ?? company.website;
    company.email = data.email ?? company.email;
    company.phone = data.phone ?? company.phone;
    company.logoUrl = logoUrl ?? company.logoUrl;
    company.bannerUrl = bannerUrl ?? company.bannerUrl;
    company.headquarters = data.headquarters ?? company.headquarters;
    company.locations = data.locations ?? company.locations;

    await company.save();

    res.status(200).json({ message: "Company updated successfully!", company });
  } catch (error) {
    console.error("Error in editing the company:", error);
    next(error);
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.params.id;
    const userId = req.user?.userId;
    const { password } = req?.body;

    if (!companyId || !userId) {
      res.status(401).json({ message: "Invalid request." });
      return;
    }

    if (!password) {
      res.status(401).json({ message: "Please enter your password." });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(401).json({ message: "User not found. Please log in again." });
      return;
    }

    // Verify the password
    const isMatch = await compareHashedPassword(password, user?.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect password." });
      return;
    }

    const company = await Company.findOneAndDelete({
      _id: companyId,
      createdBy: user._id,
    });

    if (!company) {
      res
        .status(404)
        .json({ message: "Company not found or not authorized to delete." });
      return;
    }

    res.status(200).json({ message: "Company deleted successfully." });
  } catch (error) {
    console.error("Error in deleting the company:", error);
    next(error);
  }
};

export const getCompanyEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyId = req.params.id;

    if (!companyId) {
      res.status(400).json({ message: "Company ID is required" });
      return;
    }

    const employees = await Employee.find({ companyId }).lean();

    const userIds = employees.map((emp) => emp.userId);

    const profiles = await Profile.find({ userId: { $in: userIds } })
      .select("fullName imageUrl userId")
      .lean();

    const profileMap = new Map(
      profiles.map((profile) => [profile.userId.toString(), profile])
    );

    const employeesWithProfiles = employees.map((emp) => ({
      ...emp,
      profile: profileMap.get(emp.userId.toString()) || null,
    }));

    res.status(200).json({ success: true, data: employeesWithProfiles });
  } catch (error) {
    console.log("Error in getting employee details :", error);
    next(error);
  }
};

export const addSocialLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const companyId = req.params.id;

    if (!companyId) {
      res.status(400).json({ message: "Missing company ID." });
      return;
    }

    const link = sanitizeInput(req.body?.link);

    linkSchema.parse(link);

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: companyId, createdBy: userId },
      { $push: { socialLinks: link } },
      { new: true }
    );

    if (!updatedCompany) {
      res.status(404).json({ message: "Company not found or unauthorized." });
      return;
    }

    res.status(200).json({
      message: "Social link added successfully.",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error in adding company's social links:", error);
    next(error);
  }
};

export const updateSocialLink = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const companyId = req.params.id;
    const linkId = req.params.linkId;

    if (!companyId || !linkId) {
      res.status(400).json({ message: "Missing company ID, or link ID." });
      return;
    }

    const updatedLink = sanitizeInput(req.body?.link);

    linkSchema.parse(updatedLink);

    const company = await Company.findOneAndUpdate(
      { _id: companyId, createdBy: userId, "socialLinks._id": linkId },
      {
        $set: {
          "socialLinks.$.order": updatedLink.order,
          "socialLinks.$.url": updatedLink.url,
          "socialLinks.$.name": updatedLink.name,
        },
      },
      { new: true }
    );

    if (!company) {
      res.status(404).json({ message: "Company or social link not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Social link updated successfully.", company });
  } catch (error) {
    console.error("Error updating social link:", error);
    next(error);
  }
};
