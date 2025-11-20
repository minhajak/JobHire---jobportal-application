import React from "react";
import useRecommendedFollows from "../hooks/useRecommendedFollows";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "../../../components";
import type { ApiFollowUser } from "../../../lib/types/followType";
import { cn } from "../../../lib/utils";
import followBackground from "../../../assets/networks/follow-background.png";
import useInitials from "../../../hooks/useInitials";
import Loader from "./Loader";
import { PlusIcon, XIcon } from "lucide-react";

const FollowCards: React.FC = () => {
  const {
    isLoading,
    recommendations,
    handleRemoveRecommendation,
    handleFollow,
    isFollowing,
  } = useRecommendedFollows();

  if (isLoading) return <Loader />;

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="border mt-3 bg-white rounded-[5px]">
      <h3 className="px-4 py-2 font-[500] text-[14px] text-gray-800 ">
        People you might like to follow
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 px-2 md:px-4 py-2 gap-4 pt-2">
        {recommendations.map((profile) => (
          <FollowCard
            key={profile.userId}
            profile={profile}
            onClose={() => handleRemoveRecommendation(profile.userId)}
            onFollow={() => handleFollow(profile.userId)}
            loading={isFollowing(profile.userId)}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowCards;

const FollowCard = ({
  profile,
  onClose,
  onFollow,
  loading,
}: {
  profile: ApiFollowUser;
  onClose: () => void;
  onFollow: () => void;
  loading: boolean;
}) => {
  const initials = useInitials(profile.fullName);

  return (
    <div
      className={cn(
        "bg-inherit relative overflow-hidden w-full max-w-full mx-auto border",
        "transition-all duration-100 ease-in-out",
        "rounded-[5px]"
        // removed general cursor-pointer so only actionable elements look clickable
      )}
    >
      <div
        className="col-1 absolute inset-x-0 top-0 h-[60px]"
        style={{
          backgroundImage: `url(${followBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      >
        <Button
          type="button"
          aria-label={`Close recommendation for ${profile.fullName}`}
          title="Close"
          disabled={loading}
          onClick={onClose}
          className={cn(
            `absolute top-2 right-2 z-30 p-0 rounded-full`,
            `flex items-center justify-center shadow-sm h-7 w-7 text-white bg-gray-900 opacity-70 hover:opacity-90 transition-all`
          )}
        >
          <XIcon className="bg-inherit text-white" />
        </Button>
      </div>

      <div className="flex flex-col justify-start px-2 py-2 gap-1 min-h-[180px]">
        <Avatar className="size-15 rounded-full translate-y-6">
          <AvatarImage
            className="object-cover"
            src={profile.imageUrl}
            alt={`${profile.fullName} avatar`}
          />
          <AvatarFallback>{initials ?? "np"}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 pt-6">
          <p className="font-[600] font-inter text-[14px] px-2 line-clamp-1 hover:underline">
            {profile.fullName}
          </p>
          <p className="text-[12px] font-[100] font-inter line-clamp-1 px-2">
            {profile.headline}
          </p>
        </div>

        <div className="flex flex-row items-center gap-1 text-slate-500 px-2">
          <div className="hover:text-slate-700 cursor-pointer">
            {/* svg icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="in-common-small"
              fill="currentColor"
              aria-hidden="true"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              role="img"
              aria-label=""
            >
              <path d="M11 3a5 5 0 0 0-3 1 5 5 0 1 0 0 8 5 5 0 1 0 3-9M2 8a3 3 0 0 1 4.68-2.48 4.87 4.87 0 0 0 0 5A3 3 0 0 1 5 11a3 3 0 0 1-3-3m9 3a3 3 0 0 1-1.68-.52 4.87 4.87 0 0 0 0-5A3 3 0 1 1 11 11"></path>
            </svg>
          </div>
          <p className="text-[9px] text-slate-900 font-[400] font-inter py-1">
            mutual connections
          </p>
        </div>

        <Button
          type="button"
          disabled={loading}
          className={cn(
            "flex-shrink-0 items-center border-[2px] rounded-[10px] py-[4px] md:mx-3 text-sm h-auto justify-center",
            "border-button-blue text-button-blue bg-white",
            loading && "opacity-50 cursor-not-allowed",
            "hover:bg-white hover:opacity-60"
          )}
          onClick={onFollow}
        >
          <span className="font-inter font-[500] text-[12px] flex flex-row items-center gap-1">
            {loading ? "Connecting..." : <><PlusIcon /> follow</>}
          </span>
        </Button>
      </div>
    </div>
  );
};
