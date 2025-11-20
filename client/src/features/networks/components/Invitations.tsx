import React, { type JSX } from "react";

import { ArrowLeftIcon } from "../../../components";
import { InvitationCards } from "./InvitationCards";
import { useInvitations } from "../hooks/useInvitations";

export const Invitations: React.FC = (): JSX.Element => {
  const { invites, totalCount, handleRemoveInvitation, navigate } =
    useInvitations();

  return (
    <div className="w-full bg-white md:rounded-t-[5px]">
      <div
        className="w-full p-2 px-6 flex flex-row justify-between border-b-1 cursor-pointer"
        onClick={() => {
          navigate("/networks/recieved");
        }}
      >
        <h2 className="font-inter text-[14px] font-[600]">
          Invitations ({totalCount})
        </h2>
        <button>
          <ArrowLeftIcon />
        </button>
      </div>

      <InvitationCards
        handleRemoveInvitation={handleRemoveInvitation}
        invites={invites}
      />
      <div
        className="bg-white shadow-none cursor-pointer"
        onClick={() => {
          navigate("/networks/manage");
        }}
      >
        <div className="py-3 bg-inherit px-6 flex flex-row justify-between border-b-1">
          <h2 className=" text-[14px] font-[600] ">Manage my networks</h2>
          <button>
            <ArrowLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
