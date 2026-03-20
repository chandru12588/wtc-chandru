import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle, Bike,
  Users, UsersRound, Timer, Home, Tent, Warehouse, TreePine, SlidersHorizontal
} from "lucide-react";

// 🔥 SERVICE BUTTONS (FIX)
const services = [
  { name: "Guide", value: "guide", icon: Users },
  { name: "Bike", value: "bike", icon: Bike },
  { name: "Driver", value: "driver", icon: UsersRound },
  { name: "Stays", value: "host", icon: Home },
];

// --- MAIN CATEGORY BUTTONS ---
const categories = [
  { name: "Forest", icon: Trees, filterType:"category", value:"Forest" },
  { name: "Glamping", icon: CloudSun, filterType:"category", value:"Glamping" },
  { name: "Mountain", icon: Mountain, filterType:"category", value:"Mountain" },
  { name: "Backpacker", icon: Backpack, filterType:"category", value:"Backpacker" },
  { name: "Bike Pillion", icon: Bike, filterType:"category", value:"Bike Pillion Tour" },
  { name: "Beach", icon: Umbrella, filterType:"category", value:"Beach" },
  { name: "Desert", icon: CloudSun, filterType:"category", value:"Desert" },
  { name: "New Year Trip", icon: Timer, filterType:"category", value:"New Year Trip" },
  { name: "Chennai", icon: Castle, filterType:"region", value:"TAMILNADU" },
  { name: "Bangalore", icon: Building2, filterType:"region", value:"KARNATAKA" },
  { name: "Family", icon: Users, filterType:"tags", value:"Family" },
  { name: "Friends", icon: UsersRound, filterType:"tags", value:"Friends" },
];

// --- STAY TYPE BUTTONS ---
const stayTypes = [
  { name:"Treehouse", icon:TreePine },
  { name:"Bamboo House", icon:Warehouse },
  { name:"Glamping Tent", icon:Tent },
  { name:"Dome Stay", icon:Home },
  { name:"Cabin", icon:Home },
  { name:"Wooden Cottage", icon:Warehouse },
  { name:"Farm Stay", icon:Trees },
  { name:"Private Villa", icon:Building2 },
];

export default function CategoriesBar({ onCategorySelect, onOpenFilter }) {

  const navigate = useNavigate(); // 🔥 IMPORTANT
  const scrollRef = useRef(null);

  const scrollLeft  = () => scrollRef.current.scrollBy({ left:-300, behavior:"smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left:300, behavior:"smooth" });

  return (
    <div className="flex items-center gap-3 mt-8">

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-200 transition">
        ‹
      </button>

      {/* Scrollable */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto flex-1 scrollbar-hide">

        {/* 🔥 SERVICE BUTTONS (MAIN FIX) */}
        {services.map((s,i)=>{
          const Icon = s.icon;
          return (
            <div key={"service-"+i}
              onClick={() => navigate(`/trips?service=${s.value}`)} // 🔥 FIX
              className="min-w-[110px] h-[90px] bg-indigo-50 rounded-xl shadow 
              flex flex-col justify-center items-center cursor-pointer
              hover:bg-indigo-100 hover:scale-105 transition text-center">
              <Icon className="text-indigo-600" size={22}/>
              <p className="text-xs font-semibold mt-1">{s.name}</p>
            </div>
          );
        })}

        {/* CATEGORY BUTTONS */}
        {categories.map((c,i)=> {
          const Icon = c.icon;
          return (
            <div key={i}
              onClick={()=>onCategorySelect({
                type: c.filterType,
                value: c.value.toLowerCase()
              })}
              className="min-w-[110px] h-[90px] bg-white rounded-xl shadow 
              flex flex-col justify-center items-center cursor-pointer
              hover:scale-105 hover:shadow-md transition text-center">
              <Icon className="text-orange-600" size={22}/>
              <p className="text-xs font-semibold mt-1">{c.name}</p>
            </div>
          );
        })}

        {/* STAY TYPE BUTTONS */}
        {stayTypes.map((s,i)=>{
          const Icon = s.icon;
          return (
            <div key={i}
              onClick={()=>onCategorySelect({
                type:"stayType",
                value:s.name.toLowerCase()
              })}
              className="min-w-[110px] h-[90px] bg-orange-50 rounded-xl shadow 
              flex flex-col justify-center items-center cursor-pointer
              hover:bg-orange-100 hover:scale-105 transition text-center">
              <Icon className="text-orange-600" size={22}/>
              <p className="text-xs font-semibold mt-1">{s.name}</p>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-200 transition">
        ›
      </button>

      {/* Filter Button */}
      <button
        onClick={onOpenFilter}
        className="min-w-[110px] h-[90px] bg-gray-200 rounded-xl shadow-md
        flex flex-col justify-center items-center hover:bg-gray-300 transition">
        <SlidersHorizontal size={26}/>
        <span className="text-sm font-semibold mt-1">Filter</span>
      </button>

    </div>
  );
}