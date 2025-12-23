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

  /* ================= LOAD ADMIN + HOST PACKAGES ================= */
  useEffect(() => {
    const loadAllTrips = async () => {
      try {
        const [adminRes, hostRes] = await Promise.all([
          axios.get(`${API}/api/packages`),
          axios.get(`${API}/api/host/listings`),
        ]);

        const adminTrips = adminRes.data || [];
        const hostTrips = (hostRes.data || []).map((t) => ({
          ...t,
          isHostListing: true,
        }));

        const combined = [...adminTrips, ...hostTrips];

        setAllTrips(combined);
        setFilteredTrips(combined);
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllTrips();
  }, []);

  /* ================= ADVANCED SEARCH ================= */
  const handleSearch = ({ location, people }) => {
    let results = [...allTrips];

    if (location) {
      const q = location.toLowerCase();
      results = results.filter((t) =>
        `${t.title} ${t.location} ${t.region}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (people) {
      results = results.filter((t) =>
        t.minPeople ? people >= t.minPeople : true
      );
    }

    setFilteredTrips(results);
  };

  /* ================= WEEK / MONTH FILTER (EXOTICAMP STYLE) ================= */
  const handleTabSelect = (tab) => {
    if (tab === "all") {
      setFilteredTrips(allTrips);
      return;
    }

    const today = new Date();

    // Monday start (Exoticamp style)
    const startOfWeek = new Date(today);
    const day = today.getDay() || 7;
    startOfWeek.setDate(today.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (tab === "week") {
      setFilteredTrips(
        allTrips.filter((t) => {
          if (!t.startDate) return false;
          const d = new Date(t.startDate);
          return d >= startOfWeek && d <= endOfWeek;
        })
      );
    }

    if (tab === "month") {
      const month = today.getMonth();
      const year = today.getFullYear();

      setFilteredTrips(
        allTrips.filter((t) => {
          if (!t.startDate) return false;
          const d = new Date(t.startDate);
          return d.getMonth() === month && d.getFullYear() === year;
        })
      );
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[75vh] md:h-[80vh]">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Camping in India</h1>
          <h2 className="text-2xl md:text-4xl font-bold mt-3">
            Made Easy & Safe
          </h2>

          <div className="mt-6 bg-emerald-600 px-6 py-3 rounded-full shadow-xl">
            VERIFIED FAMILY CAMPSITES
          </div>

          <div className="absolute top-10 right-10 hidden md:block">
            <RotatingReviewBadge />
          </div>
        </div>

        <div className="absolute bottom-8 w-full px-4">
          <div className="max-w-5xl mx-auto">
            <AdvancedSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <CategoriesBar />

      {/* ================= TABS ================= */}
      <TripTabs onTabSelect={handleTabSelect} />

      {/* ================= FEATURED TRIPS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Trips</h2>

        {loading ? (
          <p className="text-gray-500">Loading trips...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length ? (
              filteredTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))
            ) : (
              <p className="text-gray-600">No trips found</p>
            )}
          </div>
        )}

        <ExploreMoreButton />
      </section>

      <PopularDestinations />
      <BlogSection />
      <TestimonialsSlider />

      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
