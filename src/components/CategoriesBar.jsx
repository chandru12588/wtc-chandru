// frontend/src/components/CategoriesBar.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, MapPinned, Filter, UsersRound, Timer
} from "lucide-react";

export default function CategoriesBar({ onCategorySelect }) {

  const scrollRef = useRef(null);

  const categories = [
    { name: "Forest", icon: Trees, category:"forest" },
    { name: "Mountain", icon: Mountain, category:"mountain" },
    { name: "Backpacker", icon: Backpack, category:"backpacker" },
    { name: "Beach", icon: Umbrella, category:"beach" },
    { name: "Friends", icon: UsersRound, category:"friends" }, // FIXED 🔥
    { name: "Family", icon: Users, category:"family" },
    { name: "Glamping", icon: CloudSun, category:"glamping" },
    { name: "Desert", icon: CloudSun, category:"desert" },

    // REGION BASED (not category)
    { name: "Chennai", icon: Castle, region:"chennai" },
    { name: "Bangalore", icon: Building2, region:"bangalore" },

    { name: "New Year Trip", icon: Timer, category:"newyear" },

    // GENERAL
    { name: "Locations", icon: MapPinned, noFilter:true }
  ];

  const scrollLeft = () => scrollRef.current.scrollBy({ left:-200, behavior:"smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left:200, behavior:"smooth" });

  const selectCategory = (item) => {
    if(item.noFilter){
      alert("Browse using search or tabs 🔍");
      return;
    }

    onCategorySelect(item);
  };

  return (
    <div className="relative mt-5 py-5 bg-white/40 backdrop-blur-xl border border-white/20 shadow-lg rounded-3xl">

      {/* LEFT BUTTON */}
      <button onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">
        ‹
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-10">

        {categories.map((c,i)=>(
          <div key={i} onClick={()=>selectCategory(c)}
            className="min-w-[110px] bg-white/70 p-4 rounded-2xl text-center cursor-pointer
            hover:bg-white hover:scale-105 hover:shadow-xl transition">
            
            <c.icon className="text-orange-600 mx-auto" size={28}/>
            <p className="text-xs font-semibold mt-2">{c.name}</p>
          </div>
        ))}

        {/* FILTER BUTTON */}
        <div onClick={()=>alert("🔍 Advanced Filter Coming")}
          className="min-w-[110px] bg-orange-50 border border-orange-300 p-4 rounded-2xl
          text-center cursor-pointer hover:bg-orange-100 hover:scale-105 transition">
          <Filter className="text-orange-600 mx-auto" size={26}/>
          <p className="text-xs mt-2 font-semibold">Filter</p>
        </div>

      </div>

      {/* RIGHT BUTTON */}
      <button onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:scale-110">
        ›
      </button>
    </div>
  );
}
