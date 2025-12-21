import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import CategoriesBar from "../components/CategoriesBar";
import TripCard from "../components/TripCard";

const API = import.meta.env.VITE_API_URL;

export default function PackagesList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

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

  // 2. Apply category filter from URL
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setActiveCategory(cat);

    if (cat === "all") {
      setFiltered(packages);
    } else {
      setFiltered(packages.filter((p) => p.category === cat));
    }
  }, [searchParams, packages]);

  // 3. When clicking categories on this page
  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === "all") {
      navigate("/packages");
    } else {
      navigate(`/packages?category=${catId}`);
    }
  };

  return (
    <div className="pt-24 pb-16 max-w-6xl mx-auto px-4">
      {/* TOP CATEGORY BAR (same style as home) */}
      <CategoriesBar active={activeCategory} onSelect={handleCategorySelect} />

      {/* PAGE TITLE / SUBTITLE */}
      <div className="mt-6 mb-4">
        <h1 className="text-3xl font-bold">Tours & Packages</h1>
        {activeCategory !== "all" && (
          <p className="text-sm text-gray-500 mt-1 capitalize">
            Showing category: <span className="font-semibold">{activeCategory}</span>
          </p>
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
