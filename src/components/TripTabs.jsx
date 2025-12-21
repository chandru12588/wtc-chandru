import React, { useState } from "react";

const tabList = [
  { id: "all", label: "Trips" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

export default function TripTabs({ onTabSelect }) {
  const [active, setActive] = useState("all");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-6 mt-8">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActive(tab.id);
              onTabSelect(tab.id);
            }}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              active === tab.id
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
