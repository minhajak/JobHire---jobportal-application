export interface ServerMessage {
  _id: string;
  content: string;
  mediaUrl?: string;
  url?: string;
  type: "text" | "image" | "pdf" | "location"; // Adjust if backend supports more
  sender?: {
    _id: string;
    name?: string;
    avatar?: string;
  };
  fileName?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  createdAt: string; // Usually ISO string from backend
  updatedAt?: string;
}

export interface Message {
  id: string;
  text?: string;
  url?: string;
  type: "text" | "image" | "document" | "audio" | "camera" | "location";
  sender: "me" | "other";
  fileName?: string;
  createdAt?: number;
  location?: { lat: number; lng: number };
  contact?: { name: string; phone: string };
}