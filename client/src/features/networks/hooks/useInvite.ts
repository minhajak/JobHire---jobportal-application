import { useState } from "react";
import {
  acceptInvite,
  rejectInvite,
} from "../../../lib/axios/connectionInstance";

export  function useInvite({
  connectId,
  onRemove,
}: {
  connectId: string;
  onRemove: (id: string) => void;
}) {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const setLoading = (id: string, isLoading: boolean) => {
    setLoadingIds((prev) => {
      const next = new Set(prev);
      if (isLoading) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const accept = async (
    connectionId: string,
    onSuccess?: () => void,
    onError?: (e: Error) => void
  ) => {
    if (!connectionId) return;

    setLoading(connectionId, true);
    try {
      await acceptInvite(connectionId);
      onSuccess?.();
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Accept invite failed");
      onError?.(e);
    } finally {
      setLoading(connectionId, false);
    }
  };


  const reject = async (
    connectionId: string,
    onSuccess?: () => void,
    onError?: (e: Error) => void
  ) => {
    if (!connectionId) return;

    setLoading(connectionId, true);
    try {
      await rejectInvite(connectionId);
      onSuccess?.();
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Reject invite failed");
      console.error(e);
      onError?.(e);
    } finally {
      setLoading(connectionId, false);
    }
  };


  const handleAccept = async () => {
    await accept(connectId, () => onRemove(connectId));
  };
  

  const handleReject = async () => {
    await reject(connectId, () => onRemove(connectId));
  };

  return {
    loadingIds,
    accept,
    reject,
    handleAccept,
    handleReject,
  };
}
