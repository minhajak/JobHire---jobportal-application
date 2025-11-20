import { useState, useEffect } from "react";
import { Badge } from "../../../components";
import { cn } from "../../../lib/utils";
import useNetworkUpdate from "../hooks/useNetworkUpdate";
import CatchupCard from "./CatchupCard";
import Loader from "./Loader";

const networkUpdateList = [
  "achievement",
  "job_change",
  "work_anniversary",
  "birthday",
  "new_position",
];

const NetworkUpdate = () => {
  const {
    updates,
    loading,
    error,
    fetchUpdates,
    handleLike,
    handleComment,
    handleCongratulate,
    handleDeleteComment,
  } = useNetworkUpdate();
  const [selected, setSelected] = useState<string>("all");

  const baseClasses =
    "text-[14px] px-2 rounded-[15px] py-1 outline-[1px] cursor-pointer capitalize transition-all duration-75 ease-in";

  const hoverClasses =
    "bg-white outline-gray-400 hover:outline-[1.5px] hover:outline-gray-700 hover:bg-slate-100";

  const activeClasses = "bg-green-900 text-white outline-none";

  // Fetch updates when component mounts or filter changes
  useEffect(() => {
    fetchUpdates(selected);
  }, [selected]);

  const handleFilterChange = (filter: string) => {
    setSelected(filter);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Filter Badges */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex gap-2 flex-wrap pt-4 px-4 pb-4">
          {/* "All" option */}
          <Badge
            key="all"
            onClick={() => handleFilterChange("all")}
            className={cn(
              baseClasses,
              selected === "all" ? activeClasses : hoverClasses
            )}
            variant="secondary"
          >
            All
          </Badge>

          {networkUpdateList.map((updateType) => (
            <Badge
              key={updateType}
              onClick={() => handleFilterChange(updateType)}
              className={cn(
                baseClasses,
                selected === updateType ? activeClasses : hoverClasses
              )}
              variant="secondary"
            >
              {updateType.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto p-4">
        <p className="text-sm text-gray-600 mb-4">
          Showing updates for: <span className="font-semibold">{selected}</span>
        </p>

        {/* Loading State */}
        {loading && (
         <Loader/>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error loading updates</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && updates.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No updates found for this filter.</p>
          </div>
        )}

        {/* Updates List */}
        {!loading && !error && updates.length > 0 && (
          <div className="space-y-4">
            {updates.map((update) => (
              <CatchupCard
                key={update._id}
                update={update}
                onLike={handleLike}
                onComment={handleComment}
                onCongratulate={handleCongratulate}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkUpdate;
