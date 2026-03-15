// frontend/src/pages/Trips.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
        // 1️⃣ Load admin packages
        const pkgRes = await axios.get(`${API}/api/packages`);
        const adminTrips = pkgRes.data.map((p) => ({
          ...p,
          isHostListing: false,
        }));

        // 2️⃣ Load approved host listings
        const hostRes = await axios.get(`${API}/api/listings`);
        const hostTrips = hostRes.data.map((l) => ({
          ...l,
          isHostListing: true,
        }));

        // 3️⃣ Combine both into a single list
        const finalTrips = [...adminTrips, ...hostTrips];

        setTrips(finalTrips);
        setFiltered(finalTrips);
      } catch (err) {
        console.error("Trips load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  /* ============================================
      APPLY CATEGORY FILTER
  ============================================ */
  useEffect(() => {
    const matchesService = (trip) => {
      if (service === "host") {
        return trip.isHostListing;
      }

      if (service === "bike") {
        return inferServiceType(trip) === "bike";
      }

      if (service === "guide") {
        return inferServiceType(trip) === "guide";
      }

      if (service === "driver") {
        return inferServiceType(trip) === "driver";
      }

      return true;
    };

    let list = trips.filter(matchesService);

    if (activeFilter?.type === "category") {
      list = list.filter(
        (t) => String(t.category || "").toLowerCase() === activeFilter.value
      );
    }

    if (activeFilter?.type === "region") {
      list = list.filter((t) => {
        const region = String(t.region || "").toLowerCase();
        const location = String(t.location || "").toLowerCase();
        return region.includes(activeFilter.value) || location.includes(activeFilter.value);
      });
    }

    if (activeFilter?.type === "tags") {
      list = list.filter((t) =>
        Array.isArray(t.tags) &&
        t.tags.some((tag) => String(tag).toLowerCase() === activeFilter.value)
      );
    }

    if (activeFilter?.type === "stayType") {
      list = list.filter(
        (t) => String(t.stayType || "").toLowerCase() === activeFilter.value
      );
    }

    setFiltered(list);
  }, [trips, activeFilter, service]);

  const handleCategoryClick = (selection) => {
    if (!selection || !selection.type) {
      setActiveCategory("all");
      setActiveFilter(null);
      return;
    }

    setActiveCategory(selection.value || "all");
    setActiveFilter(selection);
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
          {service === "bike"
            ? "No pillion rider services available."
            : service === "guide"
              ? "No tour guide services available."
              : service === "driver"
                ? "No acting driver services available."
              : service === "host"
                ? "No hosted stays available."
                : "No trips found."}
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
