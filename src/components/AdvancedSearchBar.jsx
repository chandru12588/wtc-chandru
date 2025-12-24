import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, X } from "lucide-react";

export default function AdvancedSearchBar({ onSearch, trips = [] }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  /* ✅ BUILD LOCATIONS FROM PACKAGES */
  const locations = Array.from(
    new Set(
      trips
        .map((t) => t.location)
        .filter(Boolean)
        .map((l) => l.trim())
    )
  );

  const filtered =
    query.length === 0
      ? locations
      : locations.filter((l) =>
          l.toLowerCase().includes(query.toLowerCase())
        );

  /* CLOSE PANEL */
  useEffect(() => {
    if (!showPanel) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel]);

  /* SEARCH */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({
      location,
      people: Number(people),
    });
  };

  /* CLEAR */
  const clearSearch = () => {
    setLocation("");
    setDate("");
    setPeople("");
    setQuery("");
    onSearch?.({ location: "", people: "" });
  };

  return (
    <div className="relative z-[60] w-full px-4">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-5xl mx-auto
          backdrop-blur-xl bg-white/70
          rounded-3xl shadow-2xl
          p-4 md:p-6
          grid grid-cols-1 md:grid-cols-4 gap-4
        "
      >
        {/* LOCATION */}
        <div
          onClick={() => setShowPanel(true)}
          className="flex items-center gap-3 cursor-pointer bg-white rounded-xl p-3"
        >
          <MapPin className="text-orange-500" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold">LOCATION</span>
            <span className="text-sm text-gray-600">
              {location || "Select destination"}
            </span>
          </div>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-3">
          <Calendar className="text-orange-500" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold">DATE</span>
            <input
              type="date"
              className="text-sm outline-none bg-transparent"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 bg-white rounded-xl p-3">
          <Users className="text-orange-500" />
          <div className="flex flex-col w-full">
            <span className="text-xs font-semibold">NO OF MEMBERS</span>
            <input
              type="number"
              min="1"
              placeholder="e.g. 2"
              className="text-sm outline-none bg-transparent"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl py-3"
          >
            LET’S GO
          </button>

          {(location || people) && (
            <button
              type="button"
              onClick={clearSearch}
              className="bg-gray-200 hover:bg-gray-300 rounded-xl px-4"
            >
              <X />
            </button>
          )}
        </div>
      </form>

      {/* LOCATION PANEL */}
      {showPanel && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-end md:items-center justify-center">
          <div
            ref={panelRef}
            className="bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination..."
              className="w-full border p-3 rounded-xl mb-4"
            />

            {filtered.length ? (
              filtered.map((l) => (
                <div
                  key={l}
                  onClick={() => {
                    setLocation(l);
                    setShowPanel(false);
                    setQuery("");
                  }}
                  className="py-3 px-2 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  {l}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No locations found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
