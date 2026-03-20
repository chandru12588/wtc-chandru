import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import TripCard from "../components/TripCard";
import CategoriesBar from "../components/CategoriesBar";
import StickyFilterBar from "../components/StickyFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import SkeletonGrid from "../components/SkeletonGrid";
import EmptyState from "../components/EmptyState";

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
        LOAD DATA
  ============================================ */
  useEffect(() => {
    const loadTrips = async () => {
      try {
        setLoading(true);

        const pkgRes = await axios.get(`${API}/api/packages`);
        const adminTrips = pkgRes.data.map((p) => ({
          ...p,
          isHostListing: false,
        }));

        // ✅ FIXED HOST API
        const hostRes = await axios.get(`${API}/api/host/listings/all`);
        const hostTrips = hostRes.data.map((l) => ({
          ...l,
          isHostListing: true,
        }));

        const finalTrips = [...adminTrips, ...hostTrips];

        setTrips(finalTrips);
        setFiltered(finalTrips);

        // ✅ RESET FILTERS
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
      APPLY FILTERS
  ============================================ */
  useEffect(() => {
    if (!trips.length) return;

    const matchesService = (trip) => {
      if (service === "host") return trip.isHostListing;
      if (service === "bike") return inferServiceType(trip) === "bike";
      if (service === "guide") return inferServiceType(trip) === "guide";
      if (service === "driver") return inferServiceType(trip) === "driver";
      return true;
    };

    let list = trips.filter(matchesService);

    if (activeFilter?.type === "category") {
      list = list.filter(
        (t) =>
          String(t.category || "").toLowerCase() ===
          activeFilter.value.toLowerCase()
      );
    }

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
      setFiltered(trips);
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

      {/* 🔥 PREMIUM HEADER */}
      <div className="backdrop-blur-md bg-white/60 p-4 rounded-xl shadow-sm mt-6 mb-6">
        <h1 className="text-3xl font-bold">
          {activeCategory === "all"
            ? serviceTitle
            : `${String(activeCategory).toUpperCase()} Camps`}
        </h1>
      </div>

      {/* 🔥 PREMIUM GRID */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {filtered.map((trip, i) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* MOBILE FILTER */}
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