export const SkeletonCard = () => (
  <div className="flex items-center gap-3 p-3 border-b animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-300" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="h-3 w-1/2 bg-gray-300 rounded" />
      <div className="h-3 w-1/3 bg-gray-200 rounded" />
    </div>
    <div className="h-6 w-16 bg-gray-300 rounded-lg" />
  </div>
);