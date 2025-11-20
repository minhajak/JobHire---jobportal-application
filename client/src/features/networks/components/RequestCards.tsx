import { RequestCard, useRequests } from "..";
import { SkeletonCard } from "../../../components";


export const RequestCards = () => {
  const { requests, handleRemoveRequest, loading } = useRequests();
    if (loading)
      return (
        <div className="pt-1">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      );
  return (
    <div className="grid grid-rows-1 w-full border-0 shadow-0 bg-white">
      {requests.map((req) => (
        <RequestCard
          key={req._id}
          headline={req.user.headline}
          fullName={req.user.fullName}
          requestedAt={req.requestedAt}
          imageUrl={req.user.imageUrl}
          connectId={req._id}
          handleRemoveRequest={() => handleRemoveRequest(req._id)}
        />
      ))}
      {requests.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4 bg-white">
          No requests found.
        </p>
      )}
    </div>
  );
};
