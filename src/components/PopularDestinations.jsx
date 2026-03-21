import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { api } from "../api";

export default function PopularDestinations() {
  const scrollRef = useRef(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/insights/popular-destinations?limit=10");
        setDestinations(Array.isArray(res.data) ? res.data : []);
      } catch {
        setDestinations([]);
      }
    })();
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-lg font-semibold">Popular Destinations</h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50 md:block"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {destinations.length ? (
            destinations.map((d) => (
              <div
                key={`${d.location}-${d.region}`}
                className="min-w-[220px] overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl"
              >
                {d.image ? (
                  <img src={d.image} alt={d.location} className="h-32 w-full object-cover" />
                ) : (
                  <div className="h-32 w-full bg-gradient-to-br from-emerald-100 to-slate-100" />
                )}
                <div className="p-3">
                  <div className="font-medium text-gray-800">{d.location}</div>
                  <div className="text-xs text-gray-500">{d.region}</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                    <Star size={14} fill="currentColor" />
                    <span>{(d.avgRating || 0).toFixed(1)}</span>
                    <span className="text-gray-500">({d.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No destination stats yet.</p>
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50 md:block"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
