import React, { useRef } from "react";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, MapPinned, Filter, UsersRound, Timer
} from "lucide-react";

// Naming must match DB "category" field exactly (case-insensitive)
const categories = [
  { name: "Forest", icon: Trees, category:"Forest" },
  { name: "Glamping", icon: CloudSun, category:"Glamping" },
  { name: "Mountain", icon: Mountain, category:"Mountain" },
  { name: "Backpacker", icon: Backpack, category:"Backpacker" },
  { name: "Beach", icon: Umbrella, category:"Beach" },
  { name: "Desert", icon: CloudSun, category:"Desert" },

  // Region based filters
  { name: "Chennai", icon: Castle, region:"Tamilnadu" },
  { name: "Bangalore", icon: Building2, region:"Karnataka" },

  // Type based filters (from tags)
  { name: "Family", icon: Users, type:"family" },
  { name: "Friends", icon: UsersRound, type:"friends" },

  { name: "New Year Trip", icon: Timer, category:"NewYear" },
];

export default function CategoriesBar({ onCategorySelect }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current.scrollBy({ left:-300, behavior:"smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left:300, behavior:"smooth" });

  const handleClick = (cat) => onCategorySelect(cat);

  return (
    <div className="relative mt-8 py-6 bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg">

      <button onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">
        ‹
      </button>

      <div ref={scrollRef} className="flex gap-4 px-10 overflow-x-auto scrollbar-hide">

        {categories.map((c,i)=>{
          const Icon = c.icon;
          return(
            <div key={i}
              onClick={()=>handleClick(c)}
              className="min-w-[120px] p-4 rounded-2xl bg-white/70 backdrop-blur-xl border 
              hover:bg-white hover:scale-105 hover:shadow-xl transition cursor-pointer text-center">
              <Icon className="text-orange-600 mx-auto" size={28}/>
              <p className="text-xs font-semibold mt-1">{c.name}</p>
            </div>
          );
        })}

        <div onClick={()=>alert("🔍 Advanced Filters Coming Soon")}
            className="min-w-[120px] text-center p-4 rounded-2xl bg-orange-100 hover:scale-105">
          <Filter className="text-orange-600 mx-auto" size={26}/>
          <p className="text-xs mt-2 font-semibold">Filter</p>
        </div>

      </div>

      <button onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">
        ›
      </button>
    </div>
  );
}
