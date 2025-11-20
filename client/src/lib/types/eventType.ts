export type eventType = {
  _id?: string;
  creatorId?: string;
  coverImage?: File | string;
  coverImageUrl?: string;
  eventType: string;
  eventName: string;
  timeZone?: string;
  // combined date + time fields (recommended)
  startDateTime: Date | string;
  endDateTime?: Date | string;
  externalLink?: string;
  description?: string;
  speakersId?: string[]; // refs to User (or Speaker) documents
  attendeesId?: string[]; // refs to User documents
  attendeesCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiUserEventResponseType = {
  events: eventType[];
  pagination: Pagination;
};

export type ApiEventDetailsResponseType = {
  event: eventType;
  isCreator: boolean;
};
// Event type array
export const eventTypes = ["online", "offline", "hybrid", "other"] as const;
export type EventType = (typeof eventTypes)[number];

// Time zone array
export const timeZones = [
  "UTC-05:00 (New York, Toronto)",
  "UTC-04:00 (Santiago, Caracas)",
  "UTC-03:00 (Rio de Janeiro, Buenos Aires)",
  "UTC+00:00 (London, Lisbon)",
  "UTC+01:00 (Berlin, Lagos, Paris)",
  "UTC+02:00 (Cairo, Johannesburg)",
  "UTC+03:00 (Moscow, Riyadh)",
  "UTC+04:00 (Dubai, Baku)",
  "UTC+05:00 (Tashkent, Islamabad)",
  "UTC+05:30 (Chennai, Kolkata, Mumbai, New Delhi, Sri Lanka)",
  "UTC+05:45 (Kathmandu)",
  "UTC+06:00 (Dhaka, Almaty)",
  "UTC+06:30 (Yangon)",
  "UTC+07:00 (Bangkok, Jakarta)",
  "UTC+08:00 (Beijing, Singapore, Perth)",
  "UTC+09:00 (Tokyo, Seoul)",
  "UTC+10:00 (Sydney, Vladivostok)",
  "UTC+11:00 (Solomon Is., New Caledonia)",
  "UTC+12:00 (Fiji, Kamchatka)",
] as const;

export type TimeZone = (typeof timeZones)[number];
