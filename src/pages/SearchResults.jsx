import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  // get ?location=ooty OR from any other search bar
  const keyword = query.get("location")?.toLowerCase().trim() || "";

  const API = import.meta.env.VITE_API_URL;

  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    loadPackages();
  }, [keyword]);

  const loadPackages = async () => {
    try {
      const res = await axios.get(`${API}/api/packages`);
      const all = res.data;

      setPackages(all);

      // If no keyword → show all packages
      if (!keyword) {
        setFiltered(all);
        return;
      }

      const results = all.filter((pkg) => {
        const title = pkg.title?.toLowerCase() || "";
        const location = pkg.location?.toLowerCase() || "";
        const region = pkg.region?.toLowerCase() || "";
        const category = pkg.category?.toLowerCase() || "";
        const description = pkg.description?.toLowerCase() || "";

        return (
          title.includes(keyword) ||
          location.includes(keyword) ||
          region.includes(keyword) ||
          category.includes(keyword) ||
          description.includes(keyword)
        );
      });

      setFiltered(results);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Search results for: "{keyword || "All Packages"}"
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No matching packages found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((pkg) => (
            <div
              key={pkg._id}
              className="border rounded-2xl shadow-lg p-3 hover:shadow-xl transition"
            >
              <img
                src={pkg.images?.[0] || "/no-image.png"}
                className="w-full h-40 object-cover rounded-xl"
                alt="package"
              />

              <h2 className="font-semibold text-lg mt-2">{pkg.title}</h2>

              <p className="text-sm text-gray-600">
                📍 {pkg.location || pkg.region || "Unknown place"}
              </p>

              <p className="text-xs text-gray-500">
                Category: {pkg.category || "General"}
              </p>

              <a
                href={`/packages/${pkg._id}`}
                className="text-blue-600 underline text-sm mt-2 inline-block"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
