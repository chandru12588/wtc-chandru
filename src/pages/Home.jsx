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

import { inferServiceType } from "../utils/serviceType";

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
      (trip) =>
        inferServiceType(trip) === "general" &&
        (trip.location?.toLowerCase().includes(q) ||
          trip.stayType?.toLowerCase().includes(q))
    );

    setFilteredTrips(result);

    if (!result.length) alert("No results found");
  };

  const handleCategoryFilter = (filter) => {
    let result = [...allTrips];

    if (filter.type === "stayMenu") {
      setIsFilterOpen(true);
      return;
    }

    if (filter.type === "category") {
      result = result.filter(
        (trip) => trip.category?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "region") {
      result = result.filter(
        (trip) => trip.location?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "tags") {
      result = result.filter((trip) =>
        trip.tags?.some((tag) => tag.toLowerCase() === filter.value.toLowerCase())
      );
    }

    if (filter.type === "stayType") {
      result = result.filter(
        (trip) => trip.stayType?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    setFilteredTrips(result);

    if (!result.length) alert("No stays found for this category");
  };

  const handleTripTab = (type) => {
    if (type === "all") {
      setFilteredTrips(allTrips);
      return;
    }

    const toDateOnly = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const today = toDateOnly(new Date());
    if (!today) return setFilteredTrips([]);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const result = allTrips.filter((trip) => {
      const sourceDate =
        trip.startDate ||
        (Array.isArray(trip.availableDates) ? trip.availableDates[0] : null) ||
        trip.availableFrom ||
        null;

      const tripDate = toDateOnly(sourceDate);
      if (!tripDate) return false;

      if (type === "week") {
        return tripDate >= weekStart && tripDate <= weekEnd;
      }

      if (type === "month") {
        return tripDate >= monthStart && tripDate <= monthEnd;
      }

      return false;
    });

    setFilteredTrips(result);

    if (!result.length) alert("No upcoming trips found");
  };

  const handleDrawerApply = (filters) => {
    let result = [...allTrips];

    if (filters.state) {
      result = result.filter(
        (trip) => trip.location?.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.stayType) {
      result = result.filter(
        (trip) => trip.stayType?.toLowerCase() === filters.stayType.toLowerCase()
      );
    }

    if (filters.theme) {
      result = result.filter(
        (trip) => trip.category?.toLowerCase() === filters.theme.toLowerCase()
      );
    }

    if (filters.activity) {
      result = result.filter((trip) =>
        trip.tags?.some(
          (tag) => tag.toLowerCase() === filters.activity.toLowerCase()
        )
      );
    }

    if (filters.date) {
      result = result.filter(
        (trip) => new Date(trip.startDate) >= new Date(filters.date)
      );
    }

    if (filters.instant) {
      result = result.filter((trip) => trip.instantBooking);
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
          <h1 className="text-4xl font-bold md:text-6xl drop-shadow-md">
            Camping in India
          </h1>

          <h2 className="mt-2 text-2xl font-semibold md:text-4xl drop-shadow-md">
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
              filteredTrips.map((trip) => <TripCard key={trip._id} trip={trip} />)
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
