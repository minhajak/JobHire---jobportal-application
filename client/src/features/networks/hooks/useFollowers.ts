import { useEffect, useState, useCallback } from "react";
import {
  follow,
  getFollowers,
  unFollow,
} from "../../../lib/axios/followInstance";
import type {
  ApiFollowPagination,
  ApiFollowUser,
} from "../../../lib/types/followType";

export default function useFollowers() {
  const [profiles, setProfiles] = useState<ApiFollowUser[] | undefined>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<ApiFollowPagination>();

  const handleUnfollowFollower = useCallback(async (followerId: string) => {
    try {
      console.log(`user Id : ${followerId}`);
      await unFollow(followerId);
      console.log(`successfully unfollowed  your follower`);
      // Optionally update local state to reflect change
      setProfiles((prev) =>
        prev?.map((p) =>
          p.userId === followerId ? { ...p, isFollowingBack: false } : p
        )
      );
      console.log(profiles);
    } catch (err) {
      console.log(`error unfollowing back the follower`, err);
    }
  }, []);

  const handleFollowBack = useCallback(async (followerId: string) => {
    try {
      await follow(followerId);
      console.log(`successfully followed back your follower`);
      // Optionally update local state to reflect change
      setProfiles((prev) =>
        prev?.map((p) =>
          p.userId === followerId ? { ...p, isFollowingBack: true } : p
        )
      );
      console.log(profiles);
    } catch (err) {
      console.log(`error following back the follower`, err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsloading(true);
        console.log("fetching followers profiles....");
        const res = await getFollowers();
        setProfiles(res.data.profiles);
        setPagination(res.data.pagination);
        console.log(res.data.profiles);
      } catch (err) {
        console.log("error fetching followers profiles", err);
      } finally {
        setIsloading(false);
      }
    })();
  }, []); // no dependency on handleFollowBack anymore

  return {
    profiles,
    pagination,
    isLoading,
    handleFollowBack,
    handleUnfollowFollower,
  };
}
