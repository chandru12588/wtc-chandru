import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Backpack, Building2, Compass, Headset, MapPin, Menu, Mountain, Trees, UserRound } from "lucide-react";

import AdvancedSearchBar from "../components/AdvancedSearchBar";
import CategoriesBar from "../components/CategoriesBar";
import TripCard from "../components/TripCard";
import TripTabs from "../components/TripTabs";
import HeroSlider from "../components/HeroSlider";
import TestimonialsSlider from "../components/TestimonialsSlider";
import ExploreMoreButton from "../components/ExploreMoreButton";
import PopularDestinations from "../components/PopularDestinations";
import BlogSection from "../components/BlogSection";
import RotatingReviewBadge from "../components/ReviewBadge";
import RotatingBadge from "../components/RotatingBadge";
import FilterDrawer from "../components/FilterDrawer";
import ServicesHighlight from "../components/ServicesHighlight";

import { inferServiceType } from "../utils/serviceType";

const API = import.meta.env.VITE_API_URL;
const CATEGORY_ORDER = [
  "backpacker",
  "forest",
  "glamping",
  "mountain",
  "bike pillion tour",
  "beach",
  "desert",
  "new year trip",
];

const MOBILE_QUICK_FILTERS = [
  { name: "Nearby", icon: MapPin, filter: { type: "openFilter" } },
  { name: "Forest", icon: Trees, filter: { type: "category", value: "forest" } },
  { name: "Glamping", icon: Compass, filter: { type: "category", value: "glamping" } },
  { name: "Mountain", icon: Mountain, filter: { type: "category", value: "mountain" } },
  { name: "Backpacking", icon: Backpack, filter: { type: "category", value: "backpacker" } },
  { name: "Bangalore", icon: Building2, filter: { type: "region", value: "karnataka" } },
  { name: "Chennai", icon: Building2, filter: { type: "region", value: "tamilnadu" } },
];

function sortTripsForHome(list = []) {
  return [...list].sort((a, b) => {
    const aCategory = String(a?.category || "").toLowerCase();
    const bCategory = String(b?.category || "").toLowerCase();

    const aIndex = CATEGORY_ORDER.indexOf(aCategory);
    const bIndex = CATEGORY_ORDER.indexOf(bCategory);

    const aRank = aIndex === -1 ? 999 : aIndex;
    const bRank = bIndex === -1 ? 999 : bIndex;
    if (aRank !== bRank) return aRank - bRank;

    const aDate = a?.startDate ? new Date(a.startDate).getTime() : 0;
    const bDate = b?.startDate ? new Date(b.startDate).getTime() : 0;
    return bDate - aDate;
  });
}

export default function Home() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const pkg = await axios.get(`${API}/api/packages`);
        const host = await axios.get(`${API}/api/host/listings/all`);

        const merged = [...pkg.data, ...host.data];

        const ordered = sortTripsForHome(merged);
        setAllTrips(ordered);
        setFilteredTrips(ordered);
      } catch (e) {
        console.log("Error Loading Trips", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSearch = ({ location }) => {
    if (!location) return setFilteredTrips(allTrips);

    const q = location.toLowerCase();

    const result = allTrips.filter(
      (trip) =>
        inferServiceType(trip) === "general" &&
        (trip.location?.toLowerCase().includes(q) ||
          trip.stayType?.toLowerCase().includes(q))
    );

    setFilteredTrips(sortTripsForHome(result));

    if (!result.length) alert("No results found");
  };

  const handleCategoryFilter = (filter) => {
    let result = [...allTrips];

    if (filter.type === "stayMenu") {
      setIsFilterOpen(true);
      return;
    }

    if (filter.type === "category") {
      result = result.filter(
        (trip) => trip.category?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "region") {
      result = result.filter(
        (trip) => trip.location?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "tags") {
      result = result.filter((trip) =>
        trip.tags?.some((tag) => tag.toLowerCase() === filter.value.toLowerCase())
      );
    }

    if (filter.type === "stayType") {
      result = result.filter(
        (trip) => trip.stayType?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    setFilteredTrips(sortTripsForHome(result));

    if (!result.length) alert("No stays found for this category");
  };

  const handleTripTab = (type) => {
    if (type === "all") {
      setFilteredTrips(allTrips);
      return;
    }

    const toDateOnly = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const today = toDateOnly(new Date());
    if (!today) return setFilteredTrips([]);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const result = allTrips.filter((trip) => {
      const sourceDate =
        trip.startDate ||
        (Array.isArray(trip.availableDates) ? trip.availableDates[0] : null) ||
        trip.availableFrom ||
        null;

      const tripDate = toDateOnly(sourceDate);
      if (!tripDate) return false;

      if (type === "week") {
        return tripDate >= weekStart && tripDate <= weekEnd;
      }

      if (type === "month") {
        return tripDate >= monthStart && tripDate <= monthEnd;
      }

      return false;
    });

    setFilteredTrips(sortTripsForHome(result));

    if (!result.length) alert("No upcoming trips found");
  };

  const handleDrawerApply = (filters) => {
    let result = [...allTrips];

    if (filters.state) {
      result = result.filter(
        (trip) => trip.location?.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.stayType) {
      result = result.filter(
        (trip) => trip.stayType?.toLowerCase() === filters.stayType.toLowerCase()
      );
    }

    if (filters.theme) {
      result = result.filter(
        (trip) => trip.category?.toLowerCase() === filters.theme.toLowerCase()
      );
    }

    if (filters.activity) {
      result = result.filter((trip) =>
        trip.tags?.some(
          (tag) => tag.toLowerCase() === filters.activity.toLowerCase()
        )
      );
    }

    if (filters.date) {
      result = result.filter(
        (trip) => new Date(trip.startDate) >= new Date(filters.date)
      );
    }

    if (filters.instant) {
      result = result.filter((trip) => trip.instantBooking);
    }

    setFilteredTrips(sortTripsForHome(result));
    setIsFilterOpen(false);

    if (!result.length) alert("No matching stays found");
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    handleSearch({ location: mobileSearch });
  };

  const handleMobileQuickFilter = (filter) => {
    if (filter.type === "openFilter") {
      setIsFilterOpen(true);
      return;
    }

    handleCategoryFilter(filter);
  };

  return (
    <div className="w-full overflow-x-hidden pb-20 md:pb-0">
      <section className="md:hidden px-3 pt-3">
        <div className="rounded-[26px] border border-slate-200 bg-white px-3 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
          <form onSubmit={handleMobileSearch} className="flex items-center rounded-full border border-slate-300 bg-slate-50 px-3 py-2.5">
            <MapPin size={17} className="shrink-0 text-slate-500" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Search your destination"
              className="ml-2 w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500"
            />
          </form>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {MOBILE_QUICK_FILTERS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleMobileQuickFilter(item.filter)}
                  className="min-w-[84px] rounded-2xl border border-slate-200 bg-white px-2 py-2 text-center shadow-sm"
                >
                  <Icon size={18} className="mx-auto text-slate-700" />
                  <p className="mt-1 text-xs font-semibold text-slate-700">{item.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between px-1">
          <h2 className="text-3xl font-semibold text-slate-900">Trending Community Trips</h2>
          <Link to="/trips" className="text-sm font-semibold text-orange-500">
            View All
          </Link>
        </div>
      </section>

      <section className="relative h-[68vh] w-full overflow-hidden md:h-[85vh]">
        <HeroSlider />

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-3xl font-bold drop-shadow-md md:text-6xl">
            Camping in India
          </h1>

          <h2 className="mt-2 text-xl font-semibold drop-shadow-md md:text-4xl">
            Made Easy & Safe
          </h2>

          <div className="mt-5 md:block">
            <RotatingBadge />
          </div>

          <div className="absolute right-10 top-10 hidden md:block">
            <RotatingReviewBadge />
          </div>
        </div>

        <div className="absolute bottom-5 hidden w-full px-4 md:bottom-14 md:block md:px-6">
          <div className="mx-auto mt-8 max-w-4xl">
            <AdvancedSearchBar trips={allTrips} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <div className="hidden md:block">
        <CategoriesBar
          onCategorySelect={handleCategoryFilter}
          onOpenFilter={() => setIsFilterOpen(true)}
        />
      </div>

      <div className="hidden md:block">
        <TripTabs onTabSelect={handleTripTab} />
      </div>

      <section className="mx-auto max-w-7xl px-3 py-6 md:px-5 md:py-12">
        <h2 className="mb-6 hidden text-2xl font-semibold md:block">Featured Trips</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:gap-8 md:overflow-visible md:pb-0 md:snap-none md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length ? (
              filteredTrips.map((trip) => (
                <div key={trip._id} className="min-w-[82%] snap-start md:min-w-0">
                  <TripCard trip={trip} />
                </div>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}

        <ExploreMoreButton />
      </section>

      <ServicesHighlight />
      <PopularDestinations />
      <BlogSection />
      <TestimonialsSlider />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        allTrips={allTrips}
        onApply={handleDrawerApply}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 text-orange-500">
            <Compass size={18} />
            <span className="text-xs font-semibold">Explore</span>
          </button>
          <button onClick={() => navigate("/safety")} className="flex flex-col items-center gap-1 text-slate-700">
            <Headset size={18} />
            <span className="text-xs font-medium">Support</span>
          </button>
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-slate-700">
            <UserRound size={18} />
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button onClick={() => navigate("/trips")} className="flex flex-col items-center gap-1 text-slate-700">
            <Menu size={18} />
            <span className="text-xs font-medium">Other</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
