import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import CategoriesBar from "../components/CategoriesBar";
import TripCard from "../components/TripCard";

const API = import.meta.env.VITE_API_URL;

const LOCATION_ALIAS = {
  kodaikanal: ["kodaikanal", "kookal", "poombari", "poombri", "poombuhari"],
  ooty: ["ooty", "ooty hill", "ooty hills"],
  munnar: ["munnar", "munnar hills"],
  valapari: ["valapari", "valparai"],
};

const DEDICATED_LOCATION_PATHS = {
  "/kodaikanal": "Kodaikanal",
  "/ooty": "Ooty",
  "/munnar": "Munnar",
  "/valapari": "Valapari",
};

function getLocationAliases(locationName) {
  const normalized = String(locationName || "").trim().toLowerCase();
  return LOCATION_ALIAS[normalized] || [normalized];
}

export default function PackagesList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const location = useLocation();

  // 1. Load all packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${API}/api/packages`);
        setPackages(res.data);
      } catch (err) {
        console.error("Failed to load packages", err);
      }
    };
    fetchPackages();
  }, []);

  // 2. Apply category or location filter from URL and dedicated routes
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const queryLocation = searchParams.get("location") || "";
    const dedicatedLocation = DEDICATED_LOCATION_PATHS[location.pathname] || "";
    const activeLocation = queryLocation || (cat === "all" ? dedicatedLocation : "");

    setActiveCategory(cat);
    setLocationFilter(activeLocation);

    if (activeLocation) {
      const aliases = getLocationAliases(activeLocation);
      setFiltered(
        packages.filter((p) =>
          aliases.includes(String(p.location || "").trim().toLowerCase())
        )
      );
    } else if (cat === "all") {
      setFiltered(packages);
    } else {
      setFiltered(packages.filter((p) => p.category === cat));
    }
  }, [searchParams, packages, location.pathname]);

  // 3. When clicking categories on this page
  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      navigate("/packages");
    } else {
      navigate(`/packages?category=${catId}`);
    }
  };

  const pageTitle = locationFilter ? `${locationFilter} Packages` : "Tours & Packages";
  const pageDescription = locationFilter
    ? `Showing packages for ${locationFilter}.` 
    : "Explore our full collection of tours and packages.";

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
      {/* TOP CATEGORY BAR (same style as home) */}
      <CategoriesBar active={activeCategory} onSelect={handleCategorySelect} />

      {/* PAGE TITLE / SUBTITLE */}
      <div className="mt-6 mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{pageDescription}</p>
        </div>
        {locationFilter && (
          <button
            type="button"
            title="Click or right-click to return to home"
            onClick={() => navigate("/")}
            onContextMenu={(event) => {
              event.preventDefault();
              navigate("/");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="text-lg">←</span>
            Back to Home
          </button>
        )}
      </div>

      {/* GRID LIKE EXOTICAMP */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <TripCard key={pkg._id} trip={pkg} />
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm col-span-full">
            No packages found for this category.
          </p>
        )}
      </div>
    </div>
  );
}
