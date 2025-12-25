import React, { useRef } from "react";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, UsersRound, Timer, Home // Stay type icon
} from "lucide-react";

/* ======================================================
   CATEGORY + REGION + TAGS (Stay Type opens popup)
====================================================== */
const categories = [
  // 🏞 Main Trip Categories
  { name: "Forest", icon: Trees, filterType:"category", value:"Forest" },
  { name: "Glamping", icon: CloudSun, filterType:"category", value:"Glamping" },
  { name: "Mountain", icon: Mountain, filterType:"category", value:"Mountain" },
  { name: "Backpacker", icon: Backpack, filterType:"category", value:"Backpacker" },
  { name: "Beach", icon: Umbrella, filterType:"category", value:"Beach" },
  { name: "Desert", icon: CloudSun, filterType:"category", value:"Desert" },
  { name: "New Year Trip", icon: Timer, filterType:"category", value:"New Year Trip" },

  // 📍 Region Filters
  { name: "Chennai", icon: Castle, filterType:"region", value:"Tamil Nadu" },
  { name: "Bangalore", icon: Building2, filterType:"region", value:"Karnataka" },

  // 👨‍👩‍👧 Trip Type Filters (Must match tags in DB)
  { name: "Family", icon: Users, filterType:"tags", value:"Family" },
  { name: "Friends", icon: UsersRound, filterType:"tags", value:"Friends" },
];

export default function CategoriesBar({ onCategorySelect }) {
  const scrollRef = useRef(null);

  const scrollLeft  = () => scrollRef.current.scrollBy({ left:-300, behavior:"smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left:300, behavior:"smooth" });

  return (
    <div className="relative mt-8 py-6 bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg">

      {/* Scroll Left */}
      <button
        onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110 transition"
      >
        ‹
      </button>

      <div ref={scrollRef} className="flex gap-4 px-10 overflow-x-auto scrollbar-hide">

        {/* Category / Region / Tags */}
        {categories.map((c,i)=> {
          const Icon = c.icon;
          return (
            <div key={i}
              onClick={() => onCategorySelect({ type:c.filterType, value:c.value })}
              className="min-w-[120px] p-4 rounded-2xl bg-white/70 backdrop-blur-xl border 
              hover:bg-white hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
            >
              <Icon className="text-orange-600 mx-auto" size={28}/>
              <p className="text-xs font-semibold mt-1">{c.name}</p>
            </div>
          );
        })}

        {/* 🏠 Stay Type Btn → Opens Stay List Popup */}
        <div
          onClick={() => onCategorySelect({ type:"stayMenu" })}
          className="min-w-[120px] p-4 rounded-2xl bg-white/70 backdrop-blur-xl border 
          hover:bg-orange-100 hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
        >
          <Home className="text-orange-600 mx-auto" size={28}/>
          <p className="text-xs font-semibold mt-1">Stay Type</p>
        </div>

      </div>

      {/* Scroll Right */}
      <button
        onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110 transition"
      >
        ›
      </button>
    </div>
  );
}
