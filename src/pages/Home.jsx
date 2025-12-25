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

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStayTypeOpen, setIsStayTypeOpen] = useState(false);        // ⬅ Stay Type Popup State
  const [loading, setLoading] = useState(true);

  /* ================= Load Trips ================= */
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await axios.get(`${API}/api/packages`);
        setAllTrips(res.data || []);
        setFilteredTrips(res.data || []);
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  /* ================= Search Filter ================= */
  const handleSearch = ({ location, people }) => {
    let result = [...allTrips];

    if (location) {
      const q = location.toLowerCase();
      result = result.filter(t =>
        `${t.title} ${t.location} ${t.region} ${t.category}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (people) {
      result = result.filter(t =>
        t.minPeople ? Number(people) >= t.minPeople : true
      );
    }

    setFilteredTrips(result);
    document.getElementById("featured-trips")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= CATEGORY / REGION / TAGS / STAYTYPE FILTER ================= */
  const handleCategoryFilter = (filter) => {

    // 🆕 If StayType button clicked
    if (filter.type === "stayMenu") {
      setIsStayTypeOpen(true);
      return;
    }

    let result = [...allTrips];

    if (filter.type === "category") {
      result = result.filter(p =>
        p.category?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "region") {
      result = result.filter(p =>
        p.region?.toLowerCase().includes(filter.value.toLowerCase())
      );
    }

    if (filter.type === "tags") {
      result = result.filter(p =>
        p.tags?.some(t => t.toLowerCase().includes(filter.value.toLowerCase())) ||
        p.category?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (filter.type === "stayType") {
      result = result.filter(p =>
        p.stayType?.toLowerCase() === filter.value.toLowerCase()
      );
    }

    if (result.length === 0) return alert(`🚧 No ${filter.value} trips available yet`);

    setFilteredTrips(result);
    setTimeout(() => {
      document.getElementById("featured-trips")?.scrollIntoView({ behavior:"smooth" });
    }, 150);
  };

  /* ================= Tab Filter (Week/Month) ================= */
  const handleTabSelect = (tab) => {
    if (tab === "all") return setFilteredTrips(allTrips);

    const today = new Date();

    if (tab === "week") {
      const start = new Date();
      const day = start.getDay() || 7;
      start.setDate(start.getDate() - day + 1);
      start.setHours(0,0,0,0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);

      setFilteredTrips(allTrips.filter(t => {
        const d = new Date(t.startDate);
        return d >= start && d <= end;
      }));
    }

    if (tab === "month") {
      const m = today.getMonth();
      const y = today.getFullYear();
      setFilteredTrips(allTrips.filter(t => {
        const d = new Date(t.startDate);
        return d.getMonth() === m && d.getFullYear() === y;
      }));
    }

    setTimeout(() => {
      document.getElementById("featured-trips")?.scrollIntoView({ behavior:"smooth" });
    }, 100);
  };

  /* ================= STAY TYPE LIST ================= */
  const stayTypes = [
    "Tent Stay","A-Frame Stay","Mud House","Glamping Stay","Tree House","Dome Stay",
    "Cabin / Cottage","Private Villa","Bungalow","Farm Stay","Homestay","Resort Stay"
  ];

  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative w-full h-[75vh] md:h-[80vh] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-black/25"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Camping in India</h1>
          <h2 className="text-2xl md:text-4xl font-bold mt-3">Made Easy & Safe</h2>

          <div className="mt-6"><RotatingBadge /></div>
          <div className="absolute top-10 right-10 hidden md:block"><RotatingReviewBadge /></div>
        </div>

        <div className="absolute bottom-8 w-full px-4">
          <div className="max-w-6xl mx-auto">
            <AdvancedSearchBar trips={allTrips} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <CategoriesBar onCategorySelect={handleCategoryFilter} />

      <TripTabs onTabSelect={handleTabSelect} />

      {/* =================== STAY TYPE POPUP =================== */}
      {isStayTypeOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">

            <h3 className="text-lg font-bold mb-4 text-center">Choose Stay Type</h3>

            <div className="grid grid-cols-2 gap-3">
              {stayTypes.map((s,i)=>(
                <button
                  key={i}
                  onClick={()=>{
                    handleCategoryFilter({type:"stayType", value:s});
                    setIsStayTypeOpen(false);
                  }}
                  className="p-3 border rounded-lg hover:bg-orange-100 transition"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={()=>setIsStayTypeOpen(false)}
              className="mt-4 w-full py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      <section id="featured-trips" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Trips</h2>

        {loading ? (
          <p className="text-gray-500">Loading trips...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.length > 0 ? (
              filteredTrips.map(trip => <TripCard key={trip._id} trip={trip} />)
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
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApply={() => setIsFilterOpen(false)} />
    </div>
  );
}
