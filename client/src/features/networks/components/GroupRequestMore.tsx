import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { DoorOpenIcon } from "lucide-react";

const GroupsRequestMore = ({
  handleWithdrawRequest,
}: {
  handleWithdrawRequest: () => void;
}) => {
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

      <PopoverContent className="flex flex-col w-auto py-1 px-2 border bg-white rounded-[7px] hover:bg-slate-100 shadow-[5px] transition-colors ">
        <button
          onClick={handleWithdrawRequest}
          className="flex items-center text-[12px] gap-1 justify-center  py-2 w-auto  text-red-600 rounded-[5px] transition-colors"
        >
          <DoorOpenIcon size={16} /> <span>withdraw request</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default GroupsRequestMore;
