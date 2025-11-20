import { useNavigate, type NavigateFunction } from "react-router-dom";
import { Button, Popover, PopoverContent, PopoverTrigger } from "..";
import { cn } from "../../lib/utils";

const More = ({ className }: { className?: string }) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Popover>
      <PopoverTrigger className={className}>
        <div
          className={cn(
            `hover:text-black focus:text-black transition-all ease-in`,
            className
          )}
        >
          <svg
            aria-label="More"
            role="img"
            viewBox="0 0 24 24"
            className="w-6 h-6 text-inherit fill-current"
          >
            <title>More</title>
            <rect x="3" y="7" width="18" height="2" rx="1.25" />
            <rect x="3" y="15" width="13" height="2" rx="1.25" />
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] ml-6 px-2 py-1 hover:bg-slate-200">
        <Button
          variant="ghost"
          className="text-red-900 hover:text-red-900 hover:bg-slate-200 w-full"
          onClick={() => navigate("/signout")}
        >
          logout
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default More;
