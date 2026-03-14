import React, { useEffect, useState } from "react";
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
import ServicesHighlight from "../components/ServicesHighlight";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleSearch = ({ location }) => {
    if (!location) return setFilteredTrips(allTrips);

    const q = location.toLowerCase();
    const result = allTrips.filter(
      (p) =>
        p.location?.toLowerCase().includes(q) ||
        p.stayType?.toLowerCase().includes(q)
    );

    setFilteredTrips(result);
    if (!result.length) alert("No results found");
  };

  const handleCategoryFilter = (filter) => {
    let result = [...allTrips];

    if (filter.type === "stayMenu") return setIsFilterOpen(true);

    if (filter.type === "category") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "region") {
      result = result.filter(
        (p) => p.location?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "tags") {
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === filter.value.toLowerCase())
      );
    }

    if (filter.type === "stayType") {
      result = result.filter(
        (p) => p.stayType?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    setFilteredTrips(result);
    if (!result.length) alert("No stays found for this category");
  };

  const handleTripTab = (type) => {
    if (type === "all") return setFilteredTrips(allTrips);

    const today = new Date();
    const result = allTrips.filter((trip) => {
      if (!trip.startDate) return false;

      const diff = Math.ceil(
        (new Date(trip.startDate) - today) / (1000 * 60 * 60 * 24)
      );

      return (
        (type === "week" && diff >= 0 && diff <= 7) ||
        (type === "month" && diff >= 0 && diff <= 30)
      );
    });

    setFilteredTrips(result);
    if (!result.length) alert("No upcoming trips found");
  };

  const handleDrawerApply = (filters) => {
    let result = [...allTrips];

    if (filters.state) {
      result = result.filter(
        (p) => p.location?.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.stayType) {
      result = result.filter(
        (p) => p.stayType?.toLowerCase() === filters.stayType.toLowerCase()
      );
    }

    if (filters.theme) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === filters.theme.toLowerCase()
      );
    }

    if (filters.activity) {
      result = result.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === filters.activity.toLowerCase())
      );
    }

    if (filters.date) {
      result = result.filter(
        (p) => new Date(p.startDate) >= new Date(filters.date)
      );
    }

    if (filters.instant) {
      result = result.filter((p) => p.instantBooking);
    }

    setFilteredTrips(result);
    setIsFilterOpen(false);

    if (!result.length) alert("No matching stays found");
  };

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative w-full h-[78vh] md:h-[85vh] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-4xl font-bold drop-shadow-md md:text-6xl">
            Camping in India
          </h1>
          <h2 className="mt-2 text-2xl font-semibold drop-shadow-md md:text-4xl">
            Made Easy & Safe
          </h2>

          <div className="mt-5">
            <RotatingBadge />
          </div>
          <div className="absolute right-10 top-10 hidden md:block">
            <RotatingReviewBadge />
          </div>
        </div>

        <div className="absolute bottom-5 w-full px-4 md:bottom-14 md:px-6">
          <div className="mx-auto mt-8 max-w-4xl">
            <AdvancedSearchBar trips={allTrips} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <CategoriesBar
        onCategorySelect={handleCategoryFilter}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      <TripTabs onTabSelect={handleTripTab} />

      <section className="mx-auto max-w-7xl px-5 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Featured Trips</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length ? (
              filteredTrips.map((t) => <TripCard key={t._id} trip={t} />)
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
    </div>
  );
}
