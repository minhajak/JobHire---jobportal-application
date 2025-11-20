import {
  type ApiConnectionsType,
  type ApiInvitesType,
  type ApiRequestType,
  type ApiSuggestion,
} from "../types/connectType";
import client from "./axios";

export const getMyConnections = () =>
  client.get<ApiConnectionsType>("/connect/my-connections");


export const suggestionConnections = () =>
  client.get<ApiSuggestion>("/connect/new-suggestions");

export const pendingInvites = () =>
  client.get<ApiInvitesType>("/connect/pending-invites");

export const acceptInvite = (connectionId: string) =>
  client.patch(`/connect/accept/${connectionId}`);

export const rejectInvite = (connectionId: string) =>
  client.patch(`/connect/reject/${connectionId}`);

export const requestConnection = (targetUserId: string) =>
  client.post(`/connect/request`, { targetUserId });

export const getMyRequests = () =>
  client.get<ApiRequestType>(`/connect/my-requests`);

export const removeRequests = (targetConnectionId: string) =>
  client.delete(`/connect/remove/${targetConnectionId}`);
