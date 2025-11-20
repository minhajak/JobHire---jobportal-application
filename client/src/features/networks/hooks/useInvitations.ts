import { useState, useEffect } from "react";
import type { ConnectType } from "../../../lib/types/connectType";
import { pendingInvites } from "../../../lib/axios/connectionInstance";
import { useNavigate, type NavigateFunction } from "react-router-dom";

export function useInvitations(initial: ConnectType[] = []) {
  const [invites, setInvites] = useState<ConnectType[]>(initial);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate: NavigateFunction = useNavigate();
  const [loading, SetLoading] = useState<boolean>(false);

  const handleRemoveInvitation = (id: string) => {
    setInvites((prev) => {
      const next = prev.filter((inv) => inv._id !== id);
      if (next.length === prev.length) {
        return prev;
      }
      setTotalCount((count) => Math.max(count - 1, 0));
      return next;
    });
  };
  const fetchInvites = async () => {
    try {
      SetLoading(true);
      const res = await pendingInvites();
      const { invites, totalIvites } = res.data;
      setInvites(invites);
      setTotalCount(totalIvites as number);
    } catch (err) {
      console.error("Error fetching invites", err);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchInvites();
    })();
  }, []);

  return {
    invites,
    totalCount,
    navigate,
    handleRemoveInvitation,
    loading,
  };
}
