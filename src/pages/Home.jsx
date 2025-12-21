// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

import AdvancedSearchBar from "../components/AdvancedSearchBar";
import CategoriesBar from "../components/CategoriesBar";
import TripCard from "../components/TripCard";
import TripTabs from "../components/TripTabs";

import HeroSlider from "../components/HeroSlider";
import TestimonialsSlider from "../components/TestimonialsSlider";
import ExploreMoreButton from "../components/ExploreMoreButton";
import StickyFilterBar from "../components/StickyFilterBar";
import FilterDrawer from "../components/FilterDrawer";
import PopularDestinations from "../components/PopularDestinations";
import BlogSection from "../components/BlogSection";

import RotatingReviewBadge from "../components/ReviewBadge";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [allTrips, setAllTrips] = useState([]);       // 🔹 data from backend
  const [filteredTrips, setFilteredTrips] = useState([]); // 🔹 what we show
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 1) Load packages from backend on first render
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await axios.get(`${API}/api/packages`);
        setAllTrips(res.data || []);
        setFilteredTrips(res.data || []);
      } catch (err) {
        console.error("Error loading packages:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // 🔍 2) Advanced search handler (uses real trips from backend)
  const handleSearch = (filters) => {
    const { location, date, people } = filters;

    let results = [...allTrips];

    if (location) {
      const q = location.toLowerCase();
      results = results.filter((t) => {
        const title = (t.title || "").toLowerCase();
        const loc =
          (t.location || t.region || t.city || "").toLowerCase();
        return title.includes(q) || loc.includes(q);
      });
    }

    // (Optional) date filter – you can add later if packages have dates

    if (people && Number(people) > 0) {
      // if your Package model has minPeople or maxPeople, adjust here
      results = results.filter((t) => {
        if (t.minPeople != null) {
          return Number(people) >= t.minPeople;
        }
        return true;
      });
    }

    setFilteredTrips(results);
  };

  // 3) Trip tabs (All / Week / Month) — safe even if tag not present
  const handleTabSelect = (tab) => {
    if (tab === "all") {
      setFilteredTrips(allTrips);
      return;
    }

    if (tab === "week") {
      setFilteredTrips(allTrips.filter((t) => t.tag === "week"));
      return;
    }

    if (tab === "month") {
      setFilteredTrips(allTrips.filter((t) => t.tag === "month"));
      return;
    }
  };

  return (
    <div>
      {/* =============== HERO SECTION =============== */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* Background Slider (your original images) */}
        <HeroSlider />

        {/* Dark overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* HERO CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl">
            Camping in India
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold mt-3 drop-shadow-xl">
            Made Easy &amp; Safe
          </h2>

          {/* VERIFIED BADGE */}
          <div className="mt-6 bg-emerald-600 px-6 py-3 rounded-full flex items-center gap-2 shadow-xl">
            <span className="text-white text-xl">✔</span>
            <span className="text-white font-semibold tracking-wide">
              VERIFIED FAMILY CAMPSITES
            </span>
          </div>

          {/* ⭐ ROTATING REVIEW BADGE (top-right) */}
          <div className="absolute top-10 right-10">
            <RotatingReviewBadge />
          </div>
        </div>

        {/* ADVANCED SEARCH BAR */}
        <div className="absolute bottom-10 w-full px-4">
          <div className="max-w-5xl mx-auto">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* CATEGORIES BAR BELOW HERO */}
      <CategoriesBar />

      {/* TRIP TABS (All / Week / Month) */}
      <TripTabs onTabSelect={handleTabSelect} />

      {/* POPULAR DESTINATIONS */}
      <PopularDestinations />

      {/* BLOG SECTION */}
      <BlogSection />

      {/* FEATURED TRIPS */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold mb-4">Featured Trips</h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading trips...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                // trip may be Mongo doc: use _id as key, fallback to id
                <TripCard key={trip._id || trip.id} trip={trip} />
              ))
            ) : (
              <p className="text-sm text-gray-600">
                No trips found. Try changing location / filters.
              </p>
            )}
          </div>
        )}

        <ExploreMoreButton />
      </section>

      {/* TESTIMONIALS */}
      <TestimonialsSlider />

      {/* MOBILE STICKY FILTER BAR */}
      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />

      {/* FILTER DRAWER (mobile) */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => {
          // you can later wire real filters here
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
}
