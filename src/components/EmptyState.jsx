import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        className="w-24 mb-4 opacity-70"
      />
      <h2 className="text-xl font-semibold text-gray-700">
        No trips found
      </h2>
      <p className="text-gray-500 mt-2">
        Try changing filters or explore other destinations
      </p>
    </div>
  );
}