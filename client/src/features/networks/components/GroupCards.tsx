import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import type { ApiGroupType } from "../../../lib/types/groupType";
import useGroup from "../hooks/useGroup";
import GroupsMore from "./GroupsMore";
import { AvatarFallback, SkeletonCard } from "../../../components";
import useInitials from "../../../hooks/useInitials";
import { cn } from "../../../lib/utils";

const GroupCards = () => {
  const { userGroups, isLoading, isLeaving, handleLeaveGroup } = useGroup();
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
      {userGroups?.map((group) => (
        <GroupCard
          handleLeaveGroup={handleLeaveGroup}
          isLeaving={isLeaving}
          group={group}
          key={group.id as string}
        />
      ))}
    </div>
  );
};

export default GroupCards;

// groupcard
export function GroupCard({
  group,
  isLeaving,
  handleLeaveGroup,
}: {
  group: ApiGroupType;
  isLeaving: boolean;
  handleLeaveGroup: (groupId: string) => void;
}) {
  const initials = useInitials(group.name);
  return (
    <div
      className={cn(
        `flex flex-row items-center justify-between px-5 border-b cursor-pointer`,
        isLeaving ? `opacity-50` : ``
      )}
    >
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
        <GroupsMore
          handleLeaveGroup={handleLeaveGroup}
          groupId={group.id as string}
        />
      </div>
    </div>
  );
}
