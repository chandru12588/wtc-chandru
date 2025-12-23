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
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PACKAGES ================= */
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

  /* ================= ADVANCED SEARCH ================= */
  const handleSearch = (filters) => {
    const { location, people } = filters;
    let results = [...allTrips];

    if (location) {
      const q = location.toLowerCase();
      results = results.filter((t) => {
        const title = (t.title || "").toLowerCase();
        const loc = (t.location || t.region || t.city || "").toLowerCase();
        return title.includes(q) || loc.includes(q);
      });
    }

    if (people && Number(people) > 0) {
      results = results.filter((t) =>
        t.minPeople ? Number(people) >= t.minPeople : true
      );
    }

    setFilteredTrips(results);
  };

  /* ================= TABS (ALL / WEEK / MONTH) ================= */
  const handleTabSelect = (tab) => {
    if (tab === "all") return setFilteredTrips(allTrips);
    if (tab === "week")
      return setFilteredTrips(allTrips.filter((t) => t.tag === "week"));
    if (tab === "month")
      return setFilteredTrips(allTrips.filter((t) => t.tag === "month"));
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/25" />

        {/* HERO CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl">
            Camping in India
          </h1>

          <h2 className="text-2xl md:text-4xl font-bold mt-3 drop-shadow-xl">
            Made Easy & Safe
          </h2>

          <div className="mt-6 bg-emerald-600 px-6 py-3 rounded-full flex items-center gap-2 shadow-xl">
            <span className="text-xl">✔</span>
            <span className="font-semibold tracking-wide">
              VERIFIED FAMILY CAMPSITES
            </span>
          </div>

          <div className="absolute top-10 right-10 hidden md:block">
            <RotatingReviewBadge />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="absolute bottom-8 w-full px-4">
          <div className="max-w-5xl mx-auto">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <CategoriesBar />

      {/* ================= TRIP TABS ================= */}
      <TripTabs onTabSelect={handleTabSelect} />

      {/* ================= FEATURED TRIPS (PRIORITY) ================= */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">
          Featured Trips
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Loading trips...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <TripCard key={trip._id || trip.id} trip={trip} />
              ))
            ) : (
              <p className="text-sm text-gray-600">
                No trips found. Try changing filters.
              </p>
            )}
          </div>
        )}

        <ExploreMoreButton />
      </section>

      {/* ================= POPULAR DESTINATIONS ================= */}
      <PopularDestinations />

      {/* ================= BLOGS / STORIES ================= */}
      <BlogSection />

      {/* ================= TESTIMONIALS ================= */}
      <TestimonialsSlider />

      {/* ================= MOBILE FILTER ================= */}
      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
