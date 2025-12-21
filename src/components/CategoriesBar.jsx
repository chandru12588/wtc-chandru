import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mountain,
  Trees,
  CloudSun,
  Backpack,
  Building2,
  Umbrella,
  Castle,
  Users,
  MapPinned,
  Filter,
  UsersRound,
  Timer,
} from "lucide-react";

// Categories + Navigation Routes
const categories = [
  { name: "Locations", icon: MapPinned },
  { name: "Forest", icon: Trees },
  { name: "Glamping", icon: CloudSun },

  // ⭐ Mountain category → navigate to /packages
  { name: "Mountain", icon: Mountain, link: "/packages" },

  { name: "Backpack", icon: Backpack },
  { name: "Bangalore", icon: Building2 },
  { name: "Beach", icon: Umbrella },
  { name: "Chennai", icon: Castle },
  { name: "Desert", icon: CloudSun },
  { name: "Family", icon: Users },
  { name: "Friends", icon: UsersRound },
  { name: "Long Trip - Xmas", icon: Timer },
];

export default function CategoriesBar() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative bg-white rounded-t-[25px] shadow-md py-6 mt-4">
      
      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        className="
          absolute left-2 top-1/2 -translate-y-1/2 
          bg-white shadow-lg p-2 rounded-full border hover:bg-gray-50
          z-10
        "
      >
        <span className="text-xl">‹</span>
      </button>

      {/* CATEGORY SCROLLER */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {categories.map((c, i) => {
          const Icon = c.icon;

          return (
            <div
              key={i}
              onClick={() => c.link && navigate(c.link)}
              className="
                min-w-[110px] bg-white rounded-2xl border border-gray-300 
                shadow-sm p-4 text-center hover:shadow-lg transition cursor-pointer
              "
            >
              <Icon className="text-orange-500 mx-auto" size={26} />
              <p className="text-xs mt-2 font-semibold text-gray-700">
                {c.name}
              </p>
            </div>
          );
        })}

        {/* FILTER BUTTON */}
        <div
          className="
            min-w-[110px] bg-gray-100 rounded-2xl border border-gray-300 
            shadow-sm p-4 text-center cursor-pointer hover:shadow-lg transition
          "
        >
          <Filter className="mx-auto text-gray-700" size={26} />
          <p className="text-xs mt-2 font-semibold text-gray-700">Filter</p>
        </div>
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        className="
          absolute right-2 top-1/2 -translate-y-1/2 
          bg-white shadow-lg p-2 rounded-full border hover:bg-gray-50
          z-10
        "
      >
        <span className="text-xl">›</span>
      </button>
    </div>
  );
}
