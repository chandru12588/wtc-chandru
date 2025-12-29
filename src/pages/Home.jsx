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
import RotatingBadge from "../components/RotatingBadge";

import StayTypePopup from "../components/StayTypePopup";
import CitySelectPopup from "../components/CitySelectPopup";

const API = import.meta.env.VITE_API_URL;

export default function Home() {

  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stayPopup, setStayPopup] = useState(false);
  const [cityPopup, setCityPopup] = useState(false);
  const [selectedStayType, setSelectedStayType] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);


  /* ============== LOAD ALL PACKAGES ============== */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/packages`);
        setAllTrips(res.data || []);
        setFilteredTrips(res.data || []);
      } catch (e) { console.log("API ERROR:", e); }
      finally { setLoading(false); }
    })();
  }, []);


  /* ============== SEARCH BAR FILTER ============== */
  const handleSearch = ({ location }) => {
    if (!location) {
      setFilteredTrips(allTrips);
      return scrollToTrips();
    }

    const q = location.toLowerCase();

    const result = allTrips.filter(t =>
      t.location?.toLowerCase().includes(q) ||
      t.stayType?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q) ||
      t.title?.toLowerCase().includes(q)
    );

    if (result.length === 0) alert("No matching stay type or city found");

    setFilteredTrips(result);
    scrollToTrips();
  };


  /* ============== CATEGORY & NEW HOST STAY TYPE FILTER ============== */
  const handleCategoryFilter = (filter) => {
    if (filter.type === "stayMenu") return setStayPopup(true);

    let result = [...allTrips];

    if (filter.type === "category")
      result = result.filter(p => p.category?.toLowerCase() === filter.value.toLowerCase());

    if (filter.type === "region")
      result = result.filter(p => p.region?.toLowerCase().includes(filter.value.toLowerCase()));

    if (filter.type === "tags")
      result = result.filter(p =>
        p.tags?.map(t => t.toLowerCase()).includes(filter.value.toLowerCase())
      );

    // ⭐ NEW — direct Stay Type selection (Treehouse, Bamboo etc.)
    if (filter.type === "stayType")
      result = result.filter(p => p.stayType?.toLowerCase() === filter.value.toLowerCase());

    if (result.length === 0) return alert("No stays found");

    setFilteredTrips(result);
    scrollToTrips();
  };


  /* ============== STAY TYPE → CITY POPUP FLOW ============== */
  function applyStayType(type) {
    setSelectedStayType(type);
    setStayPopup(false);
    setTimeout(() => setCityPopup(true), 150);
  }

  function filterByCity(city) {
    let result = allTrips.filter(p =>
      p.stayType?.toLowerCase() === selectedStayType.toLowerCase() &&
      p.location?.toLowerCase() === city.toLowerCase()
    );

    if (result.length === 0) alert(`No ${selectedStayType} available in ${city}`);

    setFilteredTrips(result);
    setCityPopup(false);
    scrollToTrips();
  }


  /* ============== THIS WEEK / THIS MONTH FILTER ============== */
  const handleTripTab = (type) => {
    if (type === "all") {
      setFilteredTrips(allTrips);
      return scrollToTrips();
    }

    const today = new Date();
    const result = allTrips.filter(pkg => {
      if (!pkg.startDate) return false;

      const tripDate = new Date(pkg.startDate);
      const diffDays = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));

      if (type === "week") return diffDays >= 0 && diffDays <= 7;
      if (type === "month") return diffDays >= 0 && diffDays <= 30;

      return false;
    });

    setFilteredTrips(result);
    scrollToTrips();
  };


  const scrollToTrips = () =>
    document.getElementById("featured-trips")?.scrollIntoView({ behavior: "smooth" });


  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO */}
      <section className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Camping in India</h1>
          <h2 className="text-2xl md:text-4xl font-bold mt-3">Made Easy & Safe</h2>

          <div className="mt-6"><RotatingBadge /></div>
          <div className="absolute top-10 right-10 hidden md:block"><RotatingReviewBadge /></div>
        </div>

        <div className="absolute bottom-8 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <AdvancedSearchBar trips={allTrips} onSearch={handleSearch}/>
          </div>
        </div>
      </section>


      <CategoriesBar onCategorySelect={handleCategoryFilter} />
      <TripTabs onTabSelect={handleTripTab} />

      {stayPopup && <StayTypePopup onSelect={applyStayType} onClose={() => setStayPopup(false)} />}
      {cityPopup && <CitySelectPopup stayType={selectedStayType} trips={allTrips} onSelect={filterByCity} onClose={() => setCityPopup(false)} />}


      {/* RESULTS */}
      <section id="featured-trips" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Trips</h2>

        {loading ? <p>Loading...</p> :
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length > 0 ?
              filteredTrips.map(t => <TripCard key={t._id} trip={t}/>) :
              <p>No trip found</p>
            }
          </div>
        }
        <ExploreMoreButton/>
      </section>

      <PopularDestinations/>
      <BlogSection/>
      <TestimonialsSlider/>

      <StickyFilterBar onOpenFilter={() => setIsFilterOpen(true)} />
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

    </div>
  );
}
