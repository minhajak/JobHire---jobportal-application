import type { CatchupUpdate } from "../types/networkUpdateType";
import client from "./axios";


// Get catchup updates with optional type filter
export const getCatchupUpdates = async (type?: string): Promise<CatchupUpdate[]> => {
  const params = type && type !== "all" ? { type } : {};
  const response = await client.get<CatchupUpdate[]>("/catchup", { params });
  return response.data;
};

// Like a catchup update
export const likeCatchupUpdate = async (updateId: string) => {
  const response = await client.post(`/catchup/${updateId}/like`);
  return response.data;
};

// Comment on a catchup update
export const commentOnCatchupUpdate = async (updateId: string, content: string) => {
  const response = await client.post(`/catchup/${updateId}/comment`, { content });
  return response.data;
};

// Congratulate on a catchup update
export const congratulateCatchupUpdate = async (updateId: string) => {
  const response = await client.post(`/catchup/${updateId}/congratulate`);
  return response.data;
};

// Delete a comment from a catchup update
export const deleteComment = async (updateId: string, commentId: string) => {
  const response = await client.delete(`/catchup/${updateId}/comment/${commentId}`);
  return response.data;
};
