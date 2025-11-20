import React from "react";

import { InvitationCards, useInvitations } from "../../features/networks";
import { SkeletonCard } from "../../components";

const RecievedPage = React.memo(function RecievedPage() {
  const { invites, handleRemoveInvitation, loading } = useInvitations();
  if (loading)
    return (
      <div className="pt-1">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  return (
    <div className="bg-white">
      {invites.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-4">
          No invites found.
        </p>
      ) : (
        <div>
          <InvitationCards
            handleRemoveInvitation={handleRemoveInvitation}
            invites={invites}
            className="pt-0 bg-white"
          />
        </div>
      )}
    </div>
  );
});

export default RecievedPage;
