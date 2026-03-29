import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Building2, Compass, MapPin, Mountain, SlidersHorizontal, Trees } from "lucide-react";

import TripCard from "../components/TripCard";
import CategoriesBar from "../components/CategoriesBar";
import StickyFilterBar from "../components/StickyFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import SkeletonGrid from "../components/SkeletonGrid";
import EmptyState from "../components/EmptyState";

import { inferServiceType } from "../utils/serviceType";

const API = import.meta.env.VITE_API_URL;
const MOBILE_QUICK_FILTERS = [
  { name: "Locations", selection: { type: "openFilter" }, icon: MapPin },
  { name: "Forest", selection: { type: "category", value: "forest" }, icon: Trees },
  { name: "Glamping", selection: { type: "category", value: "glamping" }, icon: Compass },
  { name: "Mountain", selection: { type: "category", value: "mountain" }, icon: Mountain },
  { name: "Bangalore", selection: { type: "region", value: "karnataka" }, icon: Building2 },
];

export default function Trips() {
  const [searchParams] = useSearchParams();
  const [service, setService] = useState("all");
  const [trips, setTrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const param = (searchParams.get("service") || "all").toLowerCase();
    setService(param);
  }, [searchParams]);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);

        const pkgRes = await axios.get(`${API}/api/packages`);
        const adminTrips = pkgRes.data.map((pkg) => ({
          ...pkg,
          isHostListing: false,
        }));

        const hostRes = await axios.get(`${API}/api/host/listings/all`);
        const hostTrips = hostRes.data.map((listing) => ({
          ...listing,
          isHostListing: true,
        }));

        const finalTrips = [...adminTrips, ...hostTrips];
        setTrips(finalTrips);
        setFiltered(finalTrips);
        setActiveFilter(null);
        setActiveCategory("all");
      } catch (err) {
        console.error("Trips load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const matchesService = (trip) => {
    const category = String(trip.category || "").toLowerCase();
    const title = String(trip.title || "").toLowerCase();
    const tags = Array.isArray(trip.tags)
      ? trip.tags.map((tag) => String(tag || "").toLowerCase())
      : [];
    const type = inferServiceType(trip);

    if (service === "host") return trip.isHostListing;

    if (service === "bike") {
      return (
        type === "bike" ||
        category.includes("bike") ||
        title.includes("bike") ||
        tags.includes("bike")
      );
    }

    if (service === "guide") {
      return (
        type === "guide" ||
        (type === "general" &&
          (category.includes("guide") ||
            title.includes("guide") ||
            title.includes("tour guide") ||
            tags.includes("guide")))
      );
    }

    if (service === "driver") {
      return (
        type === "driver" ||
        category.includes("driver") ||
        title.includes("driver") ||
        tags.includes("driver")
      );
    }

    return true;
  };

  useEffect(() => {
    if (!trips.length) return;

    let list = trips.filter(matchesService);

    if (activeFilter?.type === "category") {
      list = list.filter(
        (trip) =>
          String(trip.category || "").toLowerCase() ===
          activeFilter.value.toLowerCase()
      );
    }

    if (activeFilter?.type === "region") {
      list = list.filter((trip) => {
        const region = String(trip.region || "").toLowerCase();
        const location = String(trip.location || "").toLowerCase();
        return (
          region.includes(activeFilter.value.toLowerCase()) ||
          location.includes(activeFilter.value.toLowerCase())
        );
      });
    }

    if (activeFilter?.type === "tags") {
      list = list.filter(
        (trip) =>
          Array.isArray(trip.tags) &&
          trip.tags.some(
            (tag) => String(tag).toLowerCase() === activeFilter.value.toLowerCase()
          )
      );
    }

    if (activeFilter?.type === "stayType") {
      list = list.filter(
        (trip) =>
          String(trip.stayType || "").toLowerCase() ===
          activeFilter.value.toLowerCase()
      );
    }

    setFiltered(list);
  }, [trips, activeFilter, service]);

  const handleCategoryClick = (selection) => {
    if (!selection || !selection.type) {
      setActiveCategory("all");
      setActiveFilter(null);
      setFiltered(trips);
      return;
    }

    setActiveCategory(selection.value || "all");
    setActiveFilter(selection);
  };

  const handleMobileQuickFilter = (selection) => {
    if (selection?.type === "openFilter") {
      setIsFilterOpen(true);
      return;
    }
    handleCategoryClick(selection);
  };

  const handleDrawerApply = (filters) => {
    let list = trips.filter(matchesService);

    if (filters?.state) {
      list = list.filter((trip) => {
        const region = String(trip.region || "").toLowerCase();
        const location = String(trip.location || "").toLowerCase();
        const needle = String(filters.state || "").toLowerCase();
        return region.includes(needle) || location.includes(needle);
      });
    }

    if (filters?.stayType) {
      list = list.filter(
        (trip) =>
          String(trip.stayType || "").toLowerCase() ===
          String(filters.stayType || "").toLowerCase()
      );
    }

    if (filters?.theme) {
      list = list.filter(
        (trip) =>
          String(trip.category || "").toLowerCase() ===
          String(filters.theme || "").toLowerCase()
      );
    }

    if (filters?.activity) {
      list = list.filter((trip) =>
        Array.isArray(trip.tags)
          ? trip.tags.some(
              (tag) =>
                String(tag || "").toLowerCase() ===
                String(filters.activity || "").toLowerCase()
            )
          : false
      );
    }

    if (filters?.date) {
      list = list.filter(
        (trip) =>
          trip.startDate && new Date(trip.startDate) >= new Date(filters.date)
      );
    }

    if (filters?.instant) {
      list = list.filter((trip) => Boolean(trip.instantBooking));
    }

    setFiltered(list);
    setIsFilterOpen(false);
  };

  const serviceTitle =
    service === "bike"
      ? "Pillion Rider Service"
      : service === "guide"
      ? "Tour Guide Service"
      : service === "driver"
      ? "Acting Driver Service"
      : service === "host"
      ? "Hosted Stays"
      : "All Camping Packages";

  return (
    <div className="mx-auto max-w-7xl px-3 pb-20 pt-24 md:px-4 md:pb-16">
      <div className="md:hidden">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 px-3 py-3 shadow-sm">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {MOBILE_QUICK_FILTERS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleMobileQuickFilter(item.selection)}
                  className="min-w-[118px] rounded-3xl border border-slate-200 bg-slate-50 px-3 py-3 text-center"
                >
                  <Icon size={18} className="mx-auto text-orange-500" />
                  <p className="mt-1 text-sm font-semibold text-slate-700">{item.name}</p>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="min-w-[118px] rounded-3xl bg-slate-200 px-3 py-3 text-center text-slate-700"
            >
              <SlidersHorizontal size={18} className="mx-auto" />
              <p className="mt-1 text-sm font-semibold">Filter</p>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <CategoriesBar
          onCategorySelect={handleCategoryClick}
          onOpenFilter={() => setIsFilterOpen(true)}
        />
      </div>

      <div className="mb-5 mt-4 rounded-xl bg-white/70 p-3 shadow-sm backdrop-blur-md md:mt-6 md:mb-6 md:p-4">
        <h1 className="text-2xl font-bold leading-tight md:text-3xl">{serviceTitle}</h1>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
        >
          {filtered.map((trip, index) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        allTrips={trips}
        onApply={handleDrawerApply}
      />
    </div>
  );
}
