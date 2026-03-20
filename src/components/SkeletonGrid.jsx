import React from "react";

const SkeletonGrid = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="h-48 bg-gray-300 rounded-2xl"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;