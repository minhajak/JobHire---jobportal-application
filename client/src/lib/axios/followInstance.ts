import type {
  ApiFollowRecommendationsResponse,
  ApiFollowResponse,
} from "../types/followType";
import client from "./axios";

export const getFollowing = async () =>
  client.get<ApiFollowResponse>("/follow/following");

export const getFollowers = async () =>
  client.get<ApiFollowResponse>("/follow/followers");

export const follow = async (followingId: string) =>
  client.post("/follow", { followingId });

export const unFollow = async (followingId: string) =>
  client.delete(`/follow/${followingId}`);

export const getRecommendedFollows = async () =>
  client.get<ApiFollowRecommendationsResponse>("/follow/recommendations");
