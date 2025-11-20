import { useCallback, useEffect, useState } from "react";
import { follow, getFollowing, unFollow } from "../../../lib/axios/followInstance";
import type { ApiFollowPagination, ApiFollowUser } from "../../../lib/types/followType";

export default function useFollowing() {
  const [profiles, setProfiles] = useState<ApiFollowUser[]>();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [pagination,setPagination] = useState<ApiFollowPagination>();


   const handleUnfollowFollower = useCallback(
     async (followerId: string) => {
       try {
         await unFollow(followerId);
         setProfiles((prev) =>
           prev?.map((p) =>
             p.userId === followerId ? { ...p, isFollowingBack: false } : p
           )
         );
       } catch (err) {
         console.error("error unfollowing back the follower", err);
       }
     },
     [setProfiles, unFollow]
   );

   const handleFollowBack = useCallback(
     async (followerId: string) => {
       try {
         await follow(followerId);
         setProfiles((prev) =>
           prev?.map((p) =>
             p.userId === followerId ? { ...p, isFollowingBack: true } : p
           )
         );
       } catch (err) {
         console.error("error following back the follower", err);
       }
     },
     [setProfiles, follow]
   );
  useEffect(() => {
    let isMounted = true;

    const fetchFollowing = async () => {
      try {
        setIsloading(true);
        const res = await getFollowing();
        if (!isMounted) return;
        setProfiles(res.data.profiles);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("error fetching following profiles", err);
      } finally {
        if (isMounted) {
          setIsloading(false);
        }
      }
    };

    fetchFollowing();

    return () => {
      isMounted = false;
    };
  }, [getFollowing]);  return {
    isLoading,
    profiles,
    pagination,
    handleFollowBack,
    handleUnfollowFollower
  };
}
