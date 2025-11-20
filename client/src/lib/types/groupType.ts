export type ApiGroupType = {
  canJoin?: string;
  id: string;
  name: string;
  description: string;
  image?: File | string;
  memberCount?: number;
  category: string;
  isPrivate: boolean;
  reason?: string;
  admin?: {
    _id: string;
    email: string;
  };
  members?: string[];
  tags?: string[];
  lastActivity?: Date | string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginationType = {
  currentPage: number;
  limit: number;
  totalJoined: number;
  totalPages: number;
};
export type ApiGroupResponseType = {
  joinedGroups: ApiGroupType[];
  pagination: PaginationType;
};
export type ApiGroupRequestsType = {
  groups: ApiGroupType[];
};

export type ApiGroupsRequestsType = {
  requests: ApiGroupType;
};

export type ApiGroupRecommendationsResponseType = {
  recommendations: ApiGroupType[];
};
