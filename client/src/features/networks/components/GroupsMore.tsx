import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { CopyIcon, DoorOpenIcon, SettingsIcon } from "lucide-react";

const GroupsMore = ({
  groupId,
  handleLeaveGroup,
}: {
  groupId: string;
  handleLeaveGroup: (groupId: string) => void;
}) => {
  const navigate: NavigateFunction = useNavigate();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Group link copied!"); // Replace with a toast/snackbar in production
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className=" hover:text-black focus:text-black transition-all hover:bg-slate-50 focus:bg-slate-100 rounded-lg p-2 ease-in cursor-pointer">
          <svg
            fill="currentColor"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col w-[170px] p-1 border bg-white rounded-[7px] shadow-md">
        <button
          onClick={handleCopyLink}
          className="flex items-center text-[12px] gap-1 px-3 py-2 w-full hover:bg-slate-100 rounded-md transition-colors"
        >
          <CopyIcon size={16} /> <span>Copy link to group</span>
        </button>

        <button
          onClick={() => navigate("/groups/settings")}
          className="flex items-center text-[12px] gap-1 px-3 py-2 w-full hover:bg-slate-100 rounded-md transition-colors"
        >
          <SettingsIcon size={16} /> <span>Update your settings</span>
        </button>

        <button
          onClick={() => handleLeaveGroup(groupId)}
          className="flex items-center text-[12px] gap-1 px-3 py-2 w-full hover:bg-slate-100 text-red-600 rounded-md transition-colors"
        >
          <DoorOpenIcon size={16} /> <span>Leave the group</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default GroupsMore;
