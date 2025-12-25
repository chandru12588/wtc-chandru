import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mountain, Trees, CloudSun, Backpack, Building2, Umbrella, Castle,
  Users, MapPinned, Filter, UsersRound, Timer
} from "lucide-react";

const categories = [
  { name: "Locations", icon: MapPinned },
  { name: "Forest", icon: Trees },
  { name: "Glamping", icon: CloudSun },
  { name: "Mountain", icon: Mountain, link: "/packages?category=mountain" },
  { name: "Backpacker", icon: Backpack, link: "/packages?category=backpacker" },
  { name: "Bangalore", icon: Building2, link: "/packages?region=Bangalore" },
  { name: "Beach", icon: Umbrella, link: "/packages?category=beach" },
  { name: "Chennai", icon: Castle, link: "/packages?region=Chennai" },
  { name: "Desert", icon: CloudSun, link: "/packages?category=desert" },
  { name: "Family", icon: Users, link: "/packages?type=family" },
  { name: "Friends", icon: UsersRound, link: "/packages?type=friends" },
  { name: "New Year Trip", icon: Timer, link: "/packages?category=newyear" }, // Updated
];

export default function CategoriesBar() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  const handleClick = (cat) => {
    if (!cat.link) {
      alert("🚧 Coming Soon — No trips added yet!");
      return;
    }
    navigate(cat.link);
  };

  return (
    <div className="relative mt-8 py-6
      bg-white/40 backdrop-blur-xl border border-white/30
      shadow-lg rounded-3xl overflow-hidden">

      {/* LEFT BUTTON */}
      <button
        onClick={scrollLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2
        bg-white/70 backdrop-blur-xl border p-2 rounded-full shadow-md hover:scale-110"
      >
        ‹
      </button>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 overflow-x-auto scrollbar-hide scroll-smooth"
      >

        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={() => handleClick(c)}
              className="
              min-w-[120px] text-center cursor-pointer transition-all
              bg-white/70 backdrop-blur-xl border border-gray-200
              hover:bg-white hover:shadow-xl hover:scale-105 
              p-4 rounded-2xl select-none duration-300"
            >
              <Icon className="text-orange-600 mx-auto" size={28} />
              <p className="text-xs mt-2 font-semibold text-gray-700">{c.name}</p>
            </div>
          );
        })}

        {/* FILTER BUTTON */}
        <div
          className="
          min-w-[120px] text-center cursor-pointer
          bg-orange-50 border border-orange-300
          hover:bg-orange-100 hover:shadow-lg hover:scale-105
          p-4 rounded-2xl transition duration-300"
          onClick={() => alert("🔍 Full Filter Panel Coming Soon")}
        >
          <Filter className="text-orange-600 mx-auto" size={28} />
          <p className="text-xs mt-2 font-semibold text-gray-700">Filter</p>
        </div>
      </div>

      {/* RIGHT BUTTON */}
      <button
        onClick={scrollRight}
        className="absolute right-3 top-1/2 -translate-y-1/2
        bg-white/70 backdrop-blur-xl border p-2 rounded-full shadow-md hover:scale-110"
      >
        ›
      </button>
    </div>
  );
}
