import type { ServerMessage } from "../types/chatType";
import client from "./axios";

export const getContactInfo = (userId: string) => {
  return client.get(`chats/${userId}`);
};

export const getConversations = () => client.get("chats/conversations");

// Create a new conversation
export const createConversation = (receiverId: string) =>
  client.post("chats/conversations", { participantId: receiverId });

// Get all messages in a conversation
export const getMessages = (conversationId: string) =>
  client.get<ServerMessage[]>(`/${conversationId}/messages`);

export const uploadImage = (formData: FormData) =>
  client.post("chats/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadPdf = (formData: FormData) =>
  client.post("chats/upload/pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadAudio = (formData: FormData) =>
  client.post("chats/upload/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
