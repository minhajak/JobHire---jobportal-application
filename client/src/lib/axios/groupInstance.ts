import type {
  ApiGroupRecommendationsResponseType,
  ApiGroupRequestsType,
  ApiGroupResponseType,

} from "../types/groupType";
import client from "./axios";

export const getUserGroups = () => client.get<ApiGroupResponseType>("/groups/user");

export const getRequestedGroups = () =>
  client.get<ApiGroupRequestsType>("/groups/requested");

export const createGroups = (formData: FormData) => {
  client.post("/groups", formData);
};
export const acceptJoinRequest = () => client.put("/groups/accept");

export const joinGroup = (groupId: string) =>
  client.post(`/groups/join`, { groupId });

export const getGroupRecommendations = () =>
  client.get<ApiGroupRecommendationsResponseType>(`/groups/recommendations`);

export const leaveGroup = (groupId: string) =>
  client.put(`/groups/leave/${groupId}`);
