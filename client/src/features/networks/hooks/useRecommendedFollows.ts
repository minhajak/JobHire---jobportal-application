import { useEffect, useState, useRef, useCallback } from "react";
import { follow, getRecommendedFollows } from "../../../lib/axios/followInstance";
import type { ApiFollowUser } from "../../../lib/types/followType";

export default function useRecommendedFollows(initials?: ApiFollowUser[]) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // track per-user loading: a Set of userIds currently being followed
  const [followingSet, setFollowingSet] = useState<Record<string, boolean>>({});
  const [recommendations, setRecommendations] = useState<ApiFollowUser[]>(
    initials ?? []
  );

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchFollowRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getRecommendedFollows();
      const recs = (res?.data?.recommendations as ApiFollowUser[]) ?? [];
      if (!mountedRef.current) return;
      setRecommendations(recs);
      // remove or replace console logs in production
      // console.log(res.data.recommendations);
    } catch (error) {
      console.error("error fetching follow recommendations", error);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowRecommendations();
  }, [fetchFollowRecommendations]);

  const handleRemoveRecommendation = useCallback((userId: string): void => {
    setRecommendations((prev = []) => prev.filter((rec) => !!rec && rec.userId !== userId));
  }, []);

  const handleFollow = useCallback(
    async (userId: string) => {
      if (!userId) return;
      // mark this user as loading
      setFollowingSet((s) => ({ ...s, [userId]: true }));

      try {
        await follow(userId);
        // On success remove recommendation
        handleRemoveRecommendation(userId);
      } catch (error) {
        console.error("error following recommended user", error);
        // optionally notify user of failure
      } finally {
        // clear loading flag if component still mounted
        if (mountedRef.current) {
          setFollowingSet((s) => {
            const copy = { ...s };
            delete copy[userId];
            return copy;
          });
        }
      }
    },
    [handleRemoveRecommendation]
  );

  const isFollowing = useCallback(
    (userId: string) => !!followingSet[userId],
    [followingSet]
  );

  return {
    isLoading,
    recommendations,
    handleRemoveRecommendation,
    handleFollow,
    isFollowing,
  };
}
