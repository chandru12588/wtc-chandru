// frontend/src/pages/Trips.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import TripCard from "../components/TripCard";
import CategoriesBar from "../components/CategoriesBar";
import StickyFilterBar from "../components/StickyFilterBar";
import FilterDrawer from "../components/FilterDrawer";

const API = import.meta.env.VITE_API_URL;

export default function Trips() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
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
    if (activeCategory === "all") {
      setFiltered(trips);
      return;
    }

    const list = trips.filter(
      (t) =>
        t.category &&
        t.category.toLowerCase() === activeCategory.toLowerCase()
    );

    setFiltered(list);
  }, [trips, activeCategory]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-4 pb-16">
      {/* CATEGORY BAR */}
      <CategoriesBar
        active={activeCategory}
        onSelect={handleCategoryClick}
      />

      {/* HEADER */}
      <h1 className="text-3xl font-bold mt-6 mb-6">
        {activeCategory === "all"
          ? "All Camping Packages"
          : `${activeCategory.toUpperCase()} Camps`}
      </h1>

      {/* TRIPS GRID */}
      {loading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No trips found.</p>
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
      />
    </div>
  );
}
