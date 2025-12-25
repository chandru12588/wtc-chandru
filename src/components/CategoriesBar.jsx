import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, MapPinned, Filter, UsersRound, Timer
} from "lucide-react";

// Category name must match DB "category" field exactly
const categories = [
  { name: "Forest", icon: Trees, key:"forest" },
  { name: "Glamping", icon: CloudSun, key:"glamping" },
  { name: "Mountain", icon: Mountain, key:"mountain" },
  { name: "Backpacker", icon: Backpack, key:"backpacker" },
  { name: "Beach", icon: Umbrella, key:"beach" },
  { name: "Desert", icon: CloudSun, key:"desert" },

  // Filter via region instead of category
  { name: "Chennai", icon: Castle, region:"Chennai" },
  { name: "Bangalore", icon: Building2, region:"Bangalore" },

  // Type-based filters
  { name: "Family", icon: Users, type:"family" },
  { name: "Friends", icon: UsersRound, type:"friends" },

  { name: "New Year Trip", icon: Timer, key:"newyear" },
];

export default function CategoriesBar({ onCategorySelect }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="relative mt-8 py-6
      bg-white/40 backdrop-blur-xl border border-white/30
      shadow-lg rounded-3xl overflow-hidden">

      {/* Left Scroll */}
      <button onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2
        bg-white/70 backdrop-blur-xl border p-2 rounded-full shadow-md hover:scale-110">
        ‹
      </button>

      <div ref={scrollRef} className="flex gap-4 px-10 overflow-x-auto scrollbar-hide scroll-smooth">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i}
              onClick={() => onCategorySelect(c)}   // <-- Send selection to home page
              className="min-w-[120px] text-center cursor-pointer transition-all
              bg-white/70 backdrop-blur-xl border border-gray-200
              hover:bg-white hover:shadow-xl hover:scale-105 
              p-4 rounded-2xl select-none duration-300">
              
              <Icon className="text-orange-600 mx-auto" size={28} />
              <p className="text-xs mt-2 font-semibold text-gray-700">{c.name}</p>
            </div>
          );
        })}

        {/* Filter Button */}
        <div
          className="min-w-[120px] text-center cursor-pointer
          bg-orange-50 border border-orange-300
          hover:bg-orange-100 hover:shadow-lg hover:scale-105
          p-4 rounded-2xl transition duration-300"
          onClick={() => alert("🔍 Advanced Filters Coming Soon")}
        >
          <Filter className="text-orange-600 mx-auto" size={28} />
          <p className="text-xs mt-2 font-semibold text-gray-700">Filter</p>
        </div>
      </div>

      {/* Right Scroll */}
      <button onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2
        bg-white/70 backdrop-blur-xl border p-2 rounded-full shadow-md hover:scale-110">
        ›
      </button>
    </div>
  );
}
