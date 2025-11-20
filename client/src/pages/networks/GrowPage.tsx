import React from "react";
import type { JSX } from "react/jsx-runtime";
import {
  Invitations,
  ConnectCards,
  FollowCards,
  GroupGrowCards,
} from "../../features/networks";

const GrowPage: React.FC = (): JSX.Element => {
  return (
    <div className="bg-[#FAFAFA]  w-full md:rounded-t-[5px]">
      <Invitations />
      <ConnectCards />
      <FollowCards />
      <GroupGrowCards />
    </div>
  );
};

export default GrowPage;
