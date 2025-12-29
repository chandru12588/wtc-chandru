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
import PopularDestinations from "../components/PopularDestinations";
import BlogSection from "../components/BlogSection";
import RotatingReviewBadge from "../components/ReviewBadge";
import RotatingBadge from "../components/RotatingBadge";
import FilterDrawer from "../components/FilterDrawer";

const API = import.meta.env.VITE_API_URL;

export default function Home() {

  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* Fetch Data */
  useEffect(() => {
    (async () => {
      try {
        const pkg = await axios.get(`${API}/api/packages`);
        const host = await axios.get(`${API}/api/host/listings/all`);
        const merged = [...pkg.data, ...host.data];

        setAllTrips(merged);
        setFilteredTrips(merged);
      } catch (e) {
        console.log("Error Loading Trips", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* 🔍 Search */
  const handleSearch = ({ location }) => {
    if (!location) return setFilteredTrips(allTrips);

    const q = location.toLowerCase();
    const result = allTrips.filter(p =>
      p.location?.toLowerCase().includes(q) ||
      p.stayType?.toLowerCase().includes(q)
    );

    setFilteredTrips(result);
    if (!result.length) alert("No results found");
  };

  /* CATEGORY BAR FILTER FIX */
  const handleCategoryFilter = (filter) => {
    let result = [...allTrips];

    if (filter.type === "stayMenu") return setIsFilterOpen(true);

    if (filter.type === "category")
      result = result.filter(p => p.category?.toLowerCase() === filter.value.toLowerCase());

    if (filter.type === "region")
      result = result.filter(p => p.location?.toLowerCase() === filter.value.toLowerCase());

    if (filter.type === "tags")
      result = result.filter(p => p.tags?.some(t => t.toLowerCase() === filter.value.toLowerCase()));

    if (filter.type === "stayType")
      result = result.filter(p => p.stayType?.toLowerCase() === filter.value.toLowerCase());

    setFilteredTrips(result);
    if (!result.length) alert("No stays found for this category");
  };

  /* Week / Month Tabs */
  const handleTripTab = (type) => {
    if (type === "all") return setFilteredTrips(allTrips);

    const today = new Date();
    const result = allTrips.filter(trip => {
      if (!trip.startDate) return false;

      const diff = Math.ceil((new Date(trip.startDate) - today) / (1000*60*60*24));
      return (type === "week" && diff >= 0 && diff <= 7) ||
             (type === "month" && diff >= 0 && diff <= 30);
    });

    setFilteredTrips(result);
    if (!result.length) alert("No upcoming trips found");
  };

  /* Drawer Filter */
  const handleDrawerApply = (filters) => {
    let result = [...allTrips];

    if (filters.state)
      result = result.filter(p => p.location?.toLowerCase() === filters.state.toLowerCase());

    if (filters.stayType)
      result = result.filter(p => p.stayType?.toLowerCase() === filters.stayType.toLowerCase());

    if (filters.theme)
      result = result.filter(p => p.category?.toLowerCase() === filters.theme.toLowerCase());

    if (filters.activity)
      result = result.filter(p => p.tags?.some(t => t.toLowerCase() === filters.activity.toLowerCase()));

    if (filters.date)
      result = result.filter(p => new Date(p.startDate) >= new Date(filters.date));

    if (filters.instant)
      result = result.filter(p => p.instantBooking);

    setFilteredTrips(result);
    setIsFilterOpen(false);

    if (!result.length) alert("No matching stays found");
  };

  return (
    <div className="w-full overflow-x-hidden">

      {/* ---------------------- HERO SECTION ---------------------- */}
      <section className="relative w-full h-[78vh] md:h-[85vh] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">Camping in India</h1>
          <h2 className="text-2xl md:text-4xl font-semibold mt-2 drop-shadow-md">Made Easy & Safe</h2>

          <div className="mt-5"><RotatingBadge /></div>
          <div className="absolute top-10 right-10 hidden md:block"><RotatingReviewBadge /></div>
        </div>

        {/* 🔥 SEARCH BAR LOWERED WITH SPACING */}
        <div className="absolute bottom-5 md:bottom-14 w-full px-4 md:px-6">
          <div className="max-w-4xl mx-auto mt-8">
            <AdvancedSearchBar trips={allTrips} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <CategoriesBar onCategorySelect={handleCategoryFilter} onOpenFilter={() => setIsFilterOpen(true)} />

      {/* TRIP TABS (Week/Month) */}
      <TripTabs onTabSelect={handleTripTab} />

      {/* ------------------ TRIP RESULTS ------------------ */}
      <section className="max-w-7xl mx-auto px-5 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Trips</h2>

        {loading ? <p>Loading...</p> :
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length ?
              filteredTrips.map(t => <TripCard key={t._id} trip={t} />) :
              <p>No results found</p>}
          </div>
        }

        <ExploreMoreButton />
      </section>

      <PopularDestinations />
      <BlogSection />
      <TestimonialsSlider />

      {/* FILTER DRAWER */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        allTrips={allTrips}
        onApply={handleDrawerApply}
      />
    </div>
  );
}
