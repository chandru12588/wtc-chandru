import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query.toLowerCase());
  };

  return (
    <div
      className="
        bg-white shadow-lg rounded-2xl p-3 
        flex flex-col md:flex-row gap-3 items-center
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-0.5
      "
    >
      <div className="flex-1 w-full transition-all duration-300">
        <label className="text-xs font-semibold text-gray-600">
          Destination
        </label>

        <input
          type="text"
          placeholder="Search hills, waterfalls, forests..."
          className="
            w-full text-sm border rounded-xl px-4 py-2 mt-1
            focus:outline-none  
            focus:ring-2 focus:ring-emerald-500
            focus:shadow-lg focus:shadow-emerald-200/40
            transition-all duration-300
          "
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button
        onClick={handleSearch}
        className="
          w-full md:w-auto rounded-xl bg-emerald-600 text-white 
          text-sm font-semibold px-6 py-2 mt-2 md:mt-6
          transition-all duration-300
          hover:bg-emerald-700 
          hover:shadow-lg hover:shadow-emerald-300/40
          active:scale-95
        "
      >
        Search Trips
      </button>
    </div>
  );
}
