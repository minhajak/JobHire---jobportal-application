import { useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage, Card } from "../../../components";
import useInitials from "../../../hooks/useInitials";
import { timeAgo } from "../../../lib/InputValidator";

type RequestCardProps = {
  imageUrl: string;
  fullName: string;
  headline: string;
  requestedAt: Date;
  connectId: string;
  handleRemoveRequest: () => Promise<void>;
};

const RequestCardComponent = ({
  imageUrl,
  fullName,
  headline,
  requestedAt,
  handleRemoveRequest,
}: RequestCardProps) => {
  const initials = useInitials( fullName );
  const [isLoading, setIsLoading] = useState(false);

  const onWithdraw = async () => {
    setIsLoading(true);
    try {
      await handleRemoveRequest();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-row rounded-none shadow-none border-t-0 justify-between w-full px-4 py-2 bg-white">
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <Avatar className="image-invitation-ico">
          <AvatarImage className="object-cover" src={imageUrl} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col cursor-pointer">
          <span className="font-inter font-semibold text-[13px] w-36 truncate hover:underline underline-offset-2 underline-2 ">
            {fullName}
          </span>

          <span className="text-[12px] text-slate-700 leading-none font-[400] pt-1 md:truncate">
            {headline}
          </span>
          <span className=" text-[10px] text-slate-600 ">
            {timeAgo(requestedAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <button
          className="bg-white hover:bg-gray-300 px-[8px] py-[3px] shadow-md rounded-2xl text-[12px] disabled:opacity-50"
          aria-label={`Withdraw request for ${fullName}`}
          onClick={onWithdraw}
          disabled={isLoading}
        >
          {isLoading ? "Withdrawing..." : "Withdraw"}
        </button>
      </div>
    </Card>
  );
};

export const RequestCard = memo(RequestCardComponent);
RequestCard.displayName = "RequestCard";
