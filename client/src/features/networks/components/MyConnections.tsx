import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, SkeletonCard } from "../../../components";
import useMyConnections from "../hooks/useMyConnections";
import useInitials from "../../../hooks/useInitials";
import { Search } from "lucide-react";

export default function MyConnections() {
  const { connections, totalConnections, isLoading } = useMyConnections();

  if (isLoading) {
    return <div className="pt-1">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>;
  }

  return (
    <div className="bg-white md:rounded-t-[5px] md:border-t">
      <div className="px-3 py-2 pr-3 border-b flex flex-row items-center gap-2 justify-between text-gray-500">
        <span className="text-[14px] pl-2">{totalConnections} connections</span>
        <Search size={14} />
      </div>
      {connections.map((connection) => (
        <ConnectionCard
          key={connection._id}
          headline={connection.user.headline}
          fullName={connection.user.fullName}
          imageUrl={connection.user.imageUrl}
        />
      ))}
      {!totalConnections && (
        <p className="text-center text-gray-500 text-sm py-4">
          No connections found.
        </p>
      )}
    </div>
  );
}

function ConnectionCard({
  headline,
  fullName,
  imageUrl,
}: {
  key: string;
  headline: string;
  fullName: string;
  imageUrl: string;
}) {
  const initials = useInitials( fullName );

  return (
    <Card className="flex flex-row rounded-none shadow-none border-t-0 justify-between w-full px-4 py-3 cursor-pointer transition-all">
      <div className="flex flex-row items-center gap-2 cursor-pointer">
        <Avatar className="image-invitation-ico">
          <AvatarImage
            className="size-13  rounded-full object-cover"
            src={imageUrl}
            alt={fullName}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col cursor-pointer">
          <span className="font-inter font-semibold text-[13px] w-36 truncate hover:underline underline-offset-2 underline-2 ">
            {fullName}
          </span>

          <span className="text-[12px] text-slate-700 leading-none font-[400] pt-1 md:truncate">
            {headline}
          </span>
          {/* <span className=" text-[10px] text-slate-600 ">
            {timeAgo(requestedAt)}
          </span> */}
        </div>
      </div>
    </Card>
  );
}
