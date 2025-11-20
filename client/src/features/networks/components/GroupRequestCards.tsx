import { AvatarFallback, SkeletonCard } from "../../../components";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import useInitials from "../../../hooks/useInitials";
import type { ApiGroupType } from "../../../lib/types/groupType";
import useGroupRequest from "../hooks/useGroupRequest";
import GroupsRequestMore from "./GroupRequestMore";

const GroupRequestCards = () => {
  const { requestedGroups, isLoading, handleWithdrawRequest } =
    useGroupRequest();
  if (isLoading) {
    return (
      <div className="pt-1">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  return (
    <div className="bg-white">
      {requestedGroups?.map((group) => (
        <GroupRequestCard
          handleWithdrawRequest={handleWithdrawRequest}
          group={group}
          key={group.id}
        />
      ))}
    </div>
  );
};

export default GroupRequestCards;

// grouprequestscard
export function GroupRequestCard({
  group,
  handleWithdrawRequest,
}: {
  group: ApiGroupType;
  handleWithdrawRequest: () => void;
}) {
  const initials = useInitials(group.name);
  return (
    <div className="flex flex-row items-center justify-between px-5 border-b cursor-pointer">
      <div className="flex flex-row  items-center h-15 gap-2">
        <Avatar>
          <AvatarImage
            className="size-13 object-cover rounded-[5px]"
            src={
              group?.image instanceof File
                ? URL.createObjectURL(group.image)
                : group?.image
            }
          />
          <AvatarFallback>{initials ?? "np"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[14px] font-[500] text-[#000] hover:underline">
            {group.name}
          </span>
          <span className="text-[11px] font-[200] text-slate-500">
            {group.memberCount} members
          </span>
        </div>
      </div>
      <div>
        <GroupsRequestMore handleWithdrawRequest={handleWithdrawRequest} />
      </div>
    </div>
  );
}
