import type {
  ApiEventDetailsResponseType,
  ApiUserEventResponseType,
} from "../types/eventType";
import client from "./axios";

export const createEvent = async (formData: FormData) => {
  client.post(`/event`, formData);
};

export const getUserCreatedEvents = async (page: number) =>
  client.get<ApiUserEventResponseType>(`/event/user?page=${page}`);

export const getEventDetails = async (eventId: string) =>
  client.get<ApiEventDetailsResponseType>(`/event/${eventId}`);
