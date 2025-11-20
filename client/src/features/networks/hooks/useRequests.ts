import { useEffect, useState } from "react";
import {
  getMyRequests,
  removeRequests,
} from "../../../lib/axios/connectionInstance";
import type { RequestType } from "../../../lib/types/connectType";

export function useRequests() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, SetLoading] = useState<boolean>(false);

  const fetchMyRequests = async () => {
    try {
      SetLoading(true);
      const { data } = await getMyRequests();
      console.log(data.requests)
      setRequests(data.requests);
    } catch (err) {
      console.error("Error fetching invites", err);
    } finally {
      SetLoading(false);
    }
  };

  const handleRemoveRequest = async (connectionId: string) => {
    try {
      await removeRequests(connectionId);
      setRequests((prev) => prev.filter((req) => req._id !== connectionId));
    } catch (err) {
      console.error("Error removing request", err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMyRequests();
    })();
  }, []);

  return {
    requests,
    handleRemoveRequest,
    loading,
  };
}
