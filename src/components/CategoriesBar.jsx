import React, { useRef } from "react";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, Filter, UsersRound, Timer
} from "lucide-react";

/* ======================================================
   CATEGORY + REGION + TAGS  (NO STAY TYPES SHOWN HERE)
   Added -> "Stay Type" button for popup selection
====================================================== */
const categories = [
  // 🏞 Category Filters
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

  // 👨‍👩‍👧 Trip Tags
  { name: "Family", icon: Users, filterType:"tags", value:"Family" },
  { name: "Friends", icon: UsersRound, filterType:"tags", value:"Friends" },
];

export default function CategoriesBar({ onCategorySelect }) {
  const scrollRef = useRef(null);

  const scrollLeft  = () => scrollRef.current.scrollBy({ left:-300, behavior:"smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left:300, behavior:"smooth" });

  const handleClick = (item) => {
    onCategorySelect({
      type: item.filterType,       // "category" | "region" | "tags"
      value: item.value
    });
  };

  return (
    <div className="relative mt-8 py-6 bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg">

      {/* Left Scroll Button */}
      <button onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">‹</button>

      <div ref={scrollRef} className="flex gap-4 px-10 overflow-x-auto scrollbar-hide">

        {/* Main Category Buttons */}
        {categories.map((c,i)=>{
          const Icon = c.icon;
          return (
            <div key={i}
              onClick={()=>handleClick(c)}
              className="min-w-[120px] p-4 rounded-2xl bg-white/70 backdrop-blur-xl border 
              hover:bg-white hover:scale-105 hover:shadow-xl transition cursor-pointer text-center">
              <Icon className="text-orange-600 mx-auto" size={28}/>
              <p className="text-xs font-semibold mt-1">{c.name}</p>
            </div>
          );
        })}

        {/* NEW – Stay Type Dropdown Trigger */}
        <div
          onClick={() => onCategorySelect({ type:"stayMenu" })} 
          className="min-w-[120px] text-center p-4 rounded-2xl bg-white/70 backdrop-blur-xl border 
          hover:bg-white hover:scale-105 hover:shadow-xl transition cursor-pointer"
        >
          <Filter className="text-orange-600 mx-auto" size={26}/>
          <p className="text-xs mt-2 font-semibold">Stay Type</p>
        </div>

        {/* Future Filters */}
        <div onClick={()=>alert("🔍 Full Filter Panel Coming Soon")}
          className="min-w-[120px] text-center p-4 rounded-2xl bg-orange-100 hover:scale-105 cursor-pointer">
          <Filter className="text-orange-600 mx-auto" size={26}/>
          <p className="text-xs mt-2 font-semibold">Filter</p>
        </div>

      </div>

      {/* Right Scroll Button */}
      <button onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">›</button>
    </div>
  );
}
