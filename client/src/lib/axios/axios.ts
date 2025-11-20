import axios from "axios";
import { store, type AppState } from "../../store/store";

const API_BASE: string = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token: string | null = (store.getState() as AppState).auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
