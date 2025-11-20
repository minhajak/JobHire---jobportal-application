export type ProfileType = {
  _id: string;
  userId: string; // ObjectId reference to User
  fullName: string;
  imageUrl?: string;
  headline?: string;
  about?: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileSchemaType = {
  userId: string;
  fullName: string;
  imageUrl?: string;
  headline?: string;
  // Add other properties as needed
};

export type SearchParams = {
  q?: string;
  industry?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
