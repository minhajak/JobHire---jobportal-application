import React, { useCallback, useState, type ChangeEvent } from "react";
import {
  createEvent,
  getEventDetails,
  getUserCreatedEvents,
} from "../../../lib/axios/eventInstance";
import {
  type eventType,
  eventTypes,
  type Pagination,
  timeZones,
  type EventType,
  type TimeZone,
} from "../../../lib/types/eventType";

export default function useEvent() {
  const [eventName, setEventName] = useState<string>("");
  const [eventType, setEventType] = useState<EventType>(eventTypes[0]);
  const [timeZone, setTimeZone] = useState<TimeZone>(timeZones[0]);
  const [startDateTime, setStartDateTime] = useState<Date | string>(
    new Date().toISOString().slice(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState<Date | string>("");
  const [externalLink, setExternalLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [speakerId, setSpeakerId] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [userEvents, setUserEvents] = useState<eventType[]>([]);
  const [pagination, setPagination] = useState<Pagination>();

  const [eventDetails, setEventDetails] = useState<eventType | null>(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);

  let inputId = "group-image-input";

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isLoading) return;

      const formData = new FormData();
      formData.append("eventName", eventName);
      formData.append("eventType", eventType);
      formData.append("timeZone", timeZone);
      formData.append("startDateTime", new Date(startDateTime).toISOString());
      if (endDateTime)
        formData.append("endDateTime", new Date(endDateTime).toISOString());
      if (externalLink) formData.append("externalLink", externalLink);
      if (description) formData.append("description", description);
      if (speakerId.length > 0)
        formData.append("speakersId", JSON.stringify(speakerId));
      if (coverImage) formData.append("coverImage", coverImage);

      await handleForm(formData);
    },
    [
      isLoading,
      eventName,
      eventType,
      timeZone,
      startDateTime,
      endDateTime,
      externalLink,
      description,
      coverImage,
      speakerId,
    ]
  );

  const handleForm = async (formData: FormData): Promise<void> => {
    try {
      console.log("Setting loading to true");
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await createEvent(formData);
      console.log("Created event successfully", res);
    } catch (error) {
      console.log("Error in creating event", error);
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  const fetchUserCreatedEvents = useCallback(
    async (pageNumber: number) => {
      try {
        const { data } = await getUserCreatedEvents(pageNumber);
        setUserEvents((prev) => [...prev, ...data.events]);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [] // no dependencies so it's stable
  );

  const handleEventDetails = useCallback(async (eventId: string) => {
    try {
      setIsLoading(true);
      const { data } = await getEventDetails(eventId);
      setEventDetails(data.event);
      setIsCreator(data.isCreator);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setEventDetails(null);
      setIsCreator(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    handleSubmit,
    coverImage,
    description,
    setCoverImage,
    setDescription,
    endDateTime,
    eventName,
    eventType,
    externalLink,
    inputId,
    isLoading,
    setSpeakerId,
    setStartDateTime,
    setTimeZone,
    speakerId,
    startDateTime,
    timeZone,
    timeZones,
    setEventName,
    setExternalLink,
    setEndDateTime,
    setEventType,
    handleImageChange,
    fetchUserCreatedEvents,
    setIsLoading,
    userEvents,
    pagination,
    setPagination,
    setPage,
    page,
    setUserEvents,
    handleEventDetails,
    isCreator,
    eventDetails
  };
}
