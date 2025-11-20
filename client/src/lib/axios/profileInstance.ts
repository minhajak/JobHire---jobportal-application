
import type { SearchParams } from "../types/profileType";
import client from "./axios";

export const searchProfiles = (params: SearchParams) => {
  return client.get(`/search`, { params });
};
