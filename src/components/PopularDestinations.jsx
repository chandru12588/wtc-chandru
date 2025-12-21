import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ooty from "../assets/ooty.webp"
import kodai from "../assets/kodai.jpg"
import yercaud from "../assets/yercaud.jpg"
import munnar from "../assets/munnar.jpeg"
import kolli from "../assets/kolli.jpg"

const destinations = [
  {
    id: 1,
    name: "Yercaud",
    image: yercaud,
  },
  {
    id: 2,
    name: "Ooty",
    image: ooty,
  },
  {
    id: 3,
    name: "kodai",
    image: kodai,
  },
  {
    id: 4,
    name: "Munnar",
    image: munnar,
  },
  {
    id: 5,
    name: "Kolli Hills",
    image: kolli,
  },
];

export default function PopularDestinations() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-lg font-semibold mb-4">Popular Destinations</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 hidden md:block"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {destinations.map((d) => (
            <div
              key={d.id}
              className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={d.image}
                alt={d.name}
                className="h-32 w-full object-cover"
              />
              <div className="p-3 text-center font-medium text-gray-800">
                {d.name}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 hidden md:block"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
