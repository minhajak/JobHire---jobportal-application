import { useState } from "react";

import { ConnectCard } from "./ConnectCard";
import { cn } from "../../../lib/utils";
import { useSuggestions } from "../hooks/useSuggestions";
import Loader from "./Loader";

export const ConnectCards = () => {
  const { newSuggestions, handleRemoveConnection, loading } = useSuggestions();
  const [showAll, setShowAll] = useState(false);
  const visibleSuggestions = showAll
    ? newSuggestions
    : newSuggestions.slice(0, 3);
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {visibleSuggestions.length > 0 && (
        <div className="p-3 bg-white border-b">
          <div className="mb-4">
            <p className="font-inter font-[400] px-3 text-[14px]">
              People you may know based on your recent activity
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[5px] gap-y-3 px-1 transition-all transform duration-100 ease-in-out">
            {visibleSuggestions.map((u, index) => {
              const user = (u && (u.user ?? u)) || {};
              const { fullName, headline, imageUrl, userId, mutualCount } =
                user;

              return (
                <ConnectCard
                  key={index}
                  fullName={fullName}
                  headline={headline}
                  imageUrl={imageUrl}
                  userId={userId}
                  onRemove={handleRemoveConnection}
                  mutualCount={mutualCount}
                />
              );
            })}
          </div>
          {newSuggestions.length > 3 && (
            <div className="flex justify-center mt-2">
              <span
                className={cn(
                  "text-blue-500 cursor-pointer text-sm font-medium",
                  "text-gray-600 pt-2",
                  "hover:underline"
                )}
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "Show Less" : "Show All"}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};
