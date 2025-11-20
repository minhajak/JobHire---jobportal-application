import type { ApiFollowUser } from "../../../lib/types/followType";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import useFollowers from "../hooks/useFollowers";
import { DeleteDialog } from "./DeleteDialog";
import { AvatarFallback, SkeletonCard } from "../../../components";
import useInitials from "../../../hooks/useInitials";

const FollowersCards = () => {
  const {
    isLoading,
    profiles,
    pagination,
    handleFollowBack,
    handleUnfollowFollower,
  } = useFollowers();

  if (isLoading)
    return (
      <div className="pt-1">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );

  return (
    <div className="pt-1">
      {/* Total followers */}

      {pagination?.totalProfiles === 0 || !profiles || profiles.length === 0 ? (
        <div className="pt-15 flex items-center justify-center text-[14px]">
          You have no followers yet...
        </div>
      ) : (
        <>
          <span className="text-[12px] pl-3 pt-3 font-[300] text-slate-500">
            {pagination?.totalProfiles ?? 0} people are following you
          </span>
          <div className="mt-2 border-t">
            {profiles.map((profile) => (
              <FollowerCard
                key={profile.userId || profile.fullName} // use unique key if available
                profile={profile}
                handleFollowBack={handleFollowBack}
                handleUnFollow={handleUnfollowFollower}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FollowersCards;

export function FollowerCard({
  profile,
  handleFollowBack,
  handleUnFollow,
}: {
  profile: ApiFollowUser;
  handleFollowBack: (followingId: string) => void;
  handleUnFollow: (followingId: string) => void;
}) {
  const initials = useInitials(profile.fullName);
  return (
    <div className="border-b  flex flex-row items-center justify-between">
      <div className=" flex flex-row items-center gap-3 py-1 px-1 cursor-pointer">
        <Avatar>
          <AvatarImage
            className="size-13 object-cover rounded-[5px]"
            src={profile.imageUrl}
          />
          <AvatarFallback>{initials ?? "np"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="text-[13px] font-[500] hover:underline underline-offset-2">
            {profile.fullName}
          </span>
          <span className="text-[12px] truncate text-slate-700">
            {profile.headline}
          </span>
        </div>
      </div>
      <>
        {profile?.isFollowingBack ? (
          <DeleteDialog
            followerId={profile.userId}
            fullName={profile.fullName}
            handleUnfollow={handleUnFollow}
          />
        ) : (
          <button
            className="px-2 mr-2 outline-1 rounded-[10px] text-blue-800 outline-blue-800 hover:outline-blue-900 hover:outline-[1.5px] hover:bg-blue-100 transition-all duration-75"
            onClick={() => handleFollowBack(profile.userId)}
          >
            follow
          </button>
        )}
      </>
    </div>
  );
}
