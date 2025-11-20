import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  AcceptRoundedIcon,
  RejectRoundedIcon,
} from "../../../components";
import { timeAgo } from "../../../lib/InputValidator";
import useInitials from "../../../hooks/useInitials";
import { useInvite } from "../hooks/useInvite";

export const InvitationCard = ({
  imageUrl,
  fullName,
  headline,
  requestedAt,
  connectId,
  onRemove,
}: {
  imageUrl: string;
  fullName: string;
  headline: string;
  userId: string;
  requestedAt: Date;
  connectId: string;
  onRemove: (id: string) => void;
}) => {
  const { loadingIds, handleAccept, handleReject } = useInvite({
    connectId,
    onRemove,
  });
  const initials = useInitials(fullName );
  const isLoading = loadingIds.has(connectId);

  return (
    <Card className="flex flex-row rounded-none shadow-none md:w-auto border-[1px] border-t-0 border-x-0 justify-between w-full md:px-4 px-1 py-2">
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

      <div className="flex md:hidden items-center ">
        <Button
          variant="ghost"
          className="m-[10px] p-0 hover:bg-red-50"
          aria-label={`Decline ${fullName}`}
          onClick={handleReject}
          disabled={isLoading}
        >
          <RejectRoundedIcon />
        </Button>

        <Button
          variant="ghost"
          className="p-0 hover:bg-green-50"
          aria-label={`Accept ${fullName}`}
          onClick={handleAccept}
          disabled={isLoading}
        >
          <AcceptRoundedIcon />
        </Button>
      </div>
      <div className="hidden md:flex items-center  ">
        <button
          className="m-[10px] p-1 text-[500] text-[13px] hover:bg-gray-200 transition-all duration-500 rounded-[3px] ease-in-out"
          aria-label={`Decline ${fullName}`}
          onClick={handleReject}
          disabled={isLoading}
        >
          reject
        </button>

        <button
          className="py-1 px-2 outline-[#0A66C2] rounded-[12px] text-[#0A66C2] outline-1 hover:outline-2 font-[500] hover:bg-green-50 text-[14px] transition-all duration-75 ease-in-out"
          aria-label={`Accept ${fullName}`}
          onClick={handleAccept}
          disabled={isLoading}
        >
          Accept
        </button>
      </div>
    </Card>
  );
};
