import type { ConnectType } from "../../../lib/types/connectType";
import { cn } from "../../../lib/utils";
import { InvitationCard } from "./InvitationCard";

export function InvitationCards({
  invites,
  handleRemoveInvitation,
  className,
}: {
  invites: ConnectType[];
  handleRemoveInvitation: (id: string) => void;
  className?: string;
}) {
  const visibleIivites: ConnectType[] = invites.slice(0, 3) ?? invites;
  return (
    <div className={cn(" w-full border-0", className)}>
      {visibleIivites.map((inv) => (
        <InvitationCard
          key={inv._id}
          headline={inv.user.headline}
          fullName={inv.user.fullName}
          requestedAt={inv.requestedAt as Date}
          imageUrl={inv.user.imageUrl}
          userId={inv.user.userId}
          connectId={inv._id}
          onRemove={handleRemoveInvitation}
        />
      ))}
    </div>
  );
}
