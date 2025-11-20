import React from "react";
import useGroupRecommendations from "../hooks/useGroupRecommendations";
import Loader from "./Loader";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "../../../components";
import type { ApiGroupType } from "../../../lib/types/groupType";
import useInitials from "../../../hooks/useInitials";
import { cn } from "../../../lib/utils";
import connect3 from "../../../assets/networks/connect3.jpg";
import { XIcon } from "lucide-react";
// If you have a Group type, replace `any` with it:
// import type { Group } from "../types/group";

const GroupCatchupCards: React.FC = () => {
  const {
    isLoading,
    recommendations,
    handleJoin,
    joiningGroupId,
    handleCloseCard,
  } = useGroupRecommendations();

  // Loading state (simple). Replace with skeleton if you have one.
  if (isLoading) {
    return <Loader />;
  }

  // No recommendations — render nothing (or you can render a placeholder).
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="border mt-3 bg-white rounded-[5px]">
      <h3 className="px-4 py-2 font-[500] text-[14px] text-gray-800">
        Groups you may like to join
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 py-2 pb-5 gap-y-1 px-1 transition-all transform duration-100 ease-in-out">
        {recommendations.map((group) => (
          <GroupCatchupCard
            key={group.id ?? group.name}
            group={group}
            handleJoin={handleJoin}
            isJoining={joiningGroupId === group.id}
            handleCloseCard={handleCloseCard}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCatchupCards;

/* --------------------------
   Simple GroupCatchupCard
   Accepts a `group` object and renders it.
   Replace `any` with your actual Group type.
   -------------------------- */

function GroupCatchupCard({
  group,
  isJoining,
  handleJoin,
  handleCloseCard,
}: {
  group: ApiGroupType;
  isJoining: boolean;
  handleCloseCard: (groupId: string) => void;
  handleJoin: (groupId: string) => void;
}) {
  const initials = useInitials(group.name);
  return (
    <div
      className={cn(
        " bg-inherit relative overflow-hidden w-full max-w-[170px] mx-auto  ",
        isJoining && "opacity-70",
        "transition-all duration-100 ease-in-out rounded-[6px] border py-1 "
      )}
    >
      <div
        className={cn(`col-1 absolute inset-x-0 top-0 h-[60px] `)}
        style={{
          backgroundImage: `url(${connect3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      >
        <Button
          type="button"
          aria-label="Close card"
          title="Close"
          disabled={isJoining}
          onClick={() => handleCloseCard(group.id as string)}
          className={cn(
            `absolute top-2 right-1 z-30 p-0 rounded-full`,
            `flex items-center justify-center leading-none shadow-sm size-7 bg-black opacity-60 hover:opacity-100`
          )}
        >
          <XIcon className="text-white bg-inherit " />
        </Button>
      </div>

      <div className="flex flex-col justify-between items-center text-center py-1 min-h-[180px] ">
        {/* Avatar */}
        <Avatar className="size-22 rounded-none pt-1">
          <AvatarImage
            className="object-cover"
            src={group.image as unknown as string}
            alt={`${group.name} avatar`}
          />
          <AvatarFallback>{initials ?? "np"}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-bold font-inter text-[16px] line-clamp-1">
            {group.name}
          </p>
          <p className="text-[12px] font-[400] text-slate-500  font-inter line-clamp-1 px-2">
            {group.memberCount} members
          </p>
        </div>

        <button
          disabled={isJoining}
          className={cn(
            " font-inter font-[500] text-[12px] py-1 w-auto px-14",
            "flex items-center justify-center rounded-[10px]",
            "text-button-blue bg-white outline-[1.5px] outline-button-blue hover:outline-[2px]",
            isJoining && "opacity-50 cursor-not-allowed",
            "hover:bg-slate-100 transition-all duration-50 ease-in",
            "focus:outline-2 focus:bg-slate-100"
          )}
          onClick={() => handleJoin(group.id as string)}
        >
          {isJoining ? "Joining..." : "Join"}
        </button>
      </div>
    </div>
  );
}
