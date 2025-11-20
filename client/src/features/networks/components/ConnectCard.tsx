import React from "react";
import type { JSX } from "react/jsx-runtime";
import connect3 from "../../../assets/networks/connect3.jpg";
import {
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  XIcon,
} from "../../../components";
import type { ConnectUserType } from "../../../lib/types/connectType";
import { cn } from "../../../lib/utils";

import useInitials from "../../../hooks/useInitials";
import { useConnect } from "../hooks/useConnect";

export const ConnectCard = React.memo(function ConnectCard({
  userId,
  fullName,
  headline,
  imageUrl,
  onRemove,
  mutualCount,
}: ConnectUserType): JSX.Element {
  const { isConnecting, handleCloseCard, handleConnect } = useConnect({
    userId,
    onRemove,
  });

  const initials = useInitials( fullName );

  return (
    <div
      className={cn(
        " bg-inherit relative overflow-hidden w-full max-w-[170px] mx-auto  ",
        isConnecting && "opacity-70",
        "transition-all duration-100 ease-in-out rounded-[6px] border py-4"
      )}
    >
      <div
        className={cn(`col-1 absolute inset-x-0 top-0 h-[60px]`)}
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
          disabled={isConnecting}
          onClick={handleCloseCard}
          className={cn(
            `absolute top-2 right-2 z-30 p-0 rounded-full`,
            `flex items-center justify-center leading-none shadow-sm h-7 w-7 bg-transparent`
          )}
        >
          <XIcon />
        </Button>
      </div>

      <div className="flex flex-col justify-between items-center text-center py-2 gap-1 min-h-[180px]">
        {/* Avatar */}
        <Avatar className="size-13 rounded-[10px] ">
          <AvatarImage
            className="object-cover"
            src={imageUrl}
            alt={`${fullName} avatar`}
          />
          <AvatarFallback>{initials ?? "np"}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-bold font-inter text-[16px] line-clamp-1">
            {fullName}
          </p>
          <p className="text-[12px] font-[400] font-inter line-clamp-1 px-2">
            {headline}
          </p>
        </div>

        {/* Note */}

        <div className="flex flex-row items-center gap-1 text-slate-500">
         <div className=" hover:text-slate-700 cursor-pointer"> <svg
            xmlns="http://www.w3.org/2000/svg"
            id="in-common-small"
            fill="currentColor"
            aria-hidden="true"
            data-supported-dps="16x16"
            viewBox="0 0 16 16"
            data-token-id="415"
            width="16"
            height="16"
            role="img"
            aria-label=""
           
          >
            <path d="M11 3a5 5 0 0 0-3 1 5 5 0 1 0 0 8 5 5 0 1 0 3-9M2 8a3 3 0 0 1 4.68-2.48 4.87 4.87 0 0 0 0 5A3 3 0 0 1 5 11a3 3 0 0 1-3-3m9 3a3 3 0 0 1-1.68-.52 4.87 4.87 0 0 0 0-5A3 3 0 1 1 11 11"></path>
          </svg></div>
          <p className="text-[9px] text-slate-900 font-[400] font-inter py-1">
            {mutualCount} mutual connections
          </p>{" "}
        </div>

        <Button
          disabled={isConnecting}
          className={cn(
            "flex-shrink-0 items-center border-[2px] rounded-[10px] p-0 text-sm w-full h-[27px] max-w-[100px] justify-center",
            "border-button-blue text-button-blue bg-white",
            isConnecting && "opacity-50 cursor-not-allowed",
            "hover:bg-white hover:opacity-60"
          )}
          onClick={handleConnect}
        >
          <span className="font-inter font-[500] text-[12px]">
            {isConnecting ? "Connecting..." : "Connect"}
          </span>
        </Button>
      </div>
    </div>
  );
});
