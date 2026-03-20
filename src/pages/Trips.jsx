import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import TripCard from "../components/TripCard";
import CategoriesBar from "../components/CategoriesBar";
import StickyFilterBar from "../components/StickyFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import { inferServiceType } from "../utils/serviceType";

const API = import.meta.env.VITE_API_URL;

export default function Trips() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "all";

  const [trips, setTrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ============================================
        LOAD ADMIN PACKAGES + HOST LISTINGS
  ============================================ */
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);

        // ✅ ADMIN PACKAGES
        const pkgRes = await axios.get(`${API}/api/packages`);
        const adminTrips = pkgRes.data.map((p) => ({
          ...p,
          isHostListing: false,
        }));

        // ✅ FIXED API (IMPORTANT 🔥)
        const hostRes = await axios.get(`${API}/api/host/listings/all`);
        const hostTrips = hostRes.data.map((l) => ({
          ...l,
          isHostListing: true,
        }));

        const finalTrips = [...adminTrips, ...hostTrips];

        // ✅ SET STATE
        setTrips(finalTrips);
        setFiltered(finalTrips);

        // ✅ RESET FILTERS (VERY IMPORTANT)
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

  /* ============================================
      APPLY FILTERS SAFELY
  ============================================ */
  useEffect(() => {
    if (!trips.length) return; // ✅ prevents empty bug

    const matchesService = (trip) => {
      if (service === "host") return trip.isHostListing;
      if (service === "bike") return inferServiceType(trip) === "bike";
      if (service === "guide") return inferServiceType(trip) === "guide";
      if (service === "driver") return inferServiceType(trip) === "driver";
      return true;
    };

    let list = trips.filter(matchesService);

    // ✅ CATEGORY
    if (activeFilter?.type === "category") {
      list = list.filter(
        (t) =>
          String(t.category || "").toLowerCase() ===
          activeFilter.value.toLowerCase()
      );
    }

    // ✅ REGION (IMPROVED)
    if (activeFilter?.type === "region") {
      list = list.filter((t) => {
        const region = String(t.region || "").toLowerCase();
        const location = String(t.location || "").toLowerCase();
        return (
          region.includes(activeFilter.value.toLowerCase()) ||
          location.includes(activeFilter.value.toLowerCase())
        );
      });
    }

    // ✅ TAGS
    if (activeFilter?.type === "tags") {
      list = list.filter(
        (t) =>
          Array.isArray(t.tags) &&
          t.tags.some(
            (tag) =>
              String(tag).toLowerCase() ===
              activeFilter.value.toLowerCase()
          )
      );
    }

    // ✅ STAY TYPE
    if (activeFilter?.type === "stayType") {
      list = list.filter(
        (t) =>
          String(t.stayType || "").toLowerCase() ===
          activeFilter.value.toLowerCase()
      );
    }

    setFiltered(list);
  }, [trips, activeFilter, service]);

  /* ============================================
      CATEGORY CLICK
  ============================================ */
  const handleCategoryClick = (selection) => {
    if (!selection || !selection.type) {
      setActiveCategory("all");
      setActiveFilter(null);
      setFiltered(trips); // ✅ RESET RESULTS
      return;
    }

    setActiveCategory(selection.value || "all");
    setActiveFilter(selection);
  };

  /* ============================================
      TITLE
  ============================================ */
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
    <div className="max-w-7xl mx-auto pt-24 px-4 pb-16">
      
      {/* CATEGORY BAR */}
      <CategoriesBar
        onCategorySelect={handleCategoryClick}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {/* HEADER */}
      <h1 className="text-3xl font-bold mt-6 mb-6">
        {activeCategory === "all"
          ? serviceTitle
          : `${String(activeCategory).toUpperCase()} Camps`}
      </h1>

      {/* TRIPS GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          No trips found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}

      {/* MOBILE FILTER BAR */}
      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />

      {/* FILTER DRAWER */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        allTrips={trips}
      />
    </div>
  );
}