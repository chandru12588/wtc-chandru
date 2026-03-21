import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bike,
  Building2,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  MapPin,
  Mountain,
  SlidersHorizontal,
  Timer,
  Trees,
  Umbrella,
  Users,
  UsersRound,
  Backpack,
  Castle,
  TreePine,
  Warehouse,
  Home,
  Tent,
} from "lucide-react";

const categories = [
  { name: "Locations", icon: MapPin, action: "openFilter" },
  { name: "Forest", icon: Trees, filterType: "category", value: "Forest" },
  { name: "Glamping", icon: CloudSun, filterType: "category", value: "Glamping" },
  { name: "Mountain", icon: Mountain, filterType: "category", value: "Mountain" },
  { name: "Backpacking", icon: Backpack, filterType: "category", value: "Backpacker" },
  { name: "Biking", icon: Bike, filterType: "category", value: "Bike Pillion Tour" },
  { name: "Beach", icon: Umbrella, filterType: "category", value: "Beach" },
  { name: "Desert", icon: CloudSun, filterType: "category", value: "Desert" },
  { name: "New Year Trip", icon: Timer, filterType: "category", value: "New Year Trip" },
  { name: "Chennai", icon: Castle, filterType: "region", value: "TAMILNADU" },
  { name: "Bangalore", icon: Building2, filterType: "region", value: "KARNATAKA" },
  { name: "Family", icon: Users, filterType: "tags", value: "Family" },
  { name: "Friends", icon: UsersRound, filterType: "tags", value: "Friends" },
];

const stayTypes = [
  { name: "Treehouse", icon: TreePine },
  { name: "Bamboo House", icon: Warehouse },
  { name: "Glamping Tent", icon: Tent },
  { name: "Dome Stay", icon: Home },
  { name: "Cabin", icon: Home },
  { name: "Wooden Cottage", icon: Warehouse },
];

export default function CategoriesBar({ onCategorySelect, onOpenFilter }) {
  const scrollRef = useRef(null);
  const lastYRef = useRef(0);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [compact, setCompact] = useState(false);
  const [hideOnDown, setHideOnDown] = useState(false);

  const items = useMemo(
    () => [...categories, ...stayTypes.map((item) => ({ ...item, filterType: "stayType", value: item.name }))],
    []
  );

  const syncArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxLeft = el.scrollWidth - el.clientWidth - 8;
    setCanLeft(el.scrollLeft > 6);
    setCanRight(el.scrollLeft < maxLeft);
  };

  useEffect(() => {
    syncArrows();
  }, []);

  useEffect(() => {
    const onWindowScroll = () => {
      const currentY = window.scrollY;
      const isDown = currentY > lastYRef.current;

      setCompact(currentY > 110);
      setHideOnDown(isDown && currentY > 220);

      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, []);

  const scrollByAmount = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleCardClick = (item) => {
    if (item.action === "openFilter") {
      onOpenFilter?.();
      return;
    }

    onCategorySelect?.({
      type: item.filterType,
      value: String(item.value || "").toLowerCase(),
    });
  };

  return (
    <div
      className={`sticky z-40 mt-6 transition-all duration-300 ${
        compact ? "top-[58px]" : "top-[72px]"
      } ${hideOnDown ? "-translate-y-2 opacity-95" : "translate-y-0 opacity-100"}`}
    >
      <div
        className={`rounded-[38px] border border-white/70 bg-white/90 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 ${
          compact ? "py-3" : "py-4"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByAmount(-320)}
            disabled={!canLeft}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35 md:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={scrollRef}
            onScroll={syncArrows}
            className="flex flex-1 gap-4 overflow-x-auto scroll-smooth pb-1 scrollbar-hide"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleCardClick(item)}
                  className={`group min-w-[116px] rounded-3xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md ${
                    compact ? "h-[96px]" : "h-[108px]"
                  }`}
                >
                  <div className="mx-auto flex h-7 items-center justify-center text-orange-500">
                    <Icon size={24} />
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-medium text-slate-700">{item.name}</p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollByAmount(320)}
            disabled={!canRight}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35 md:flex"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            onClick={onOpenFilter}
            className={`ml-1 min-w-[104px] shrink-0 rounded-3xl bg-slate-200 px-4 text-slate-800 shadow-sm transition hover:bg-slate-300 ${
              compact ? "h-[96px]" : "h-[108px]"
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center">
              <SlidersHorizontal size={25} />
              <span className="mt-1 text-sm font-semibold">Filter</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
