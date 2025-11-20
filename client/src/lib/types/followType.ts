export type ApiFollowUser = {
  userId: string;
  fullName: string;
  headline: string;
  imageUrl: string;
  isFollowingBack?: boolean;
};

export type ApiFollowPagination = {
  totalProfiles: number;
};

export type ApiFollowResponse = {
  profiles: ApiFollowUser[];
  pagination: ApiFollowPagination;
};

export type ApiFollowRecommendationsResponse = {
  recommendations: ApiFollowUser[];
};

export type ApiUnFollowResponse = {
  success: string;
  message: string;
};
