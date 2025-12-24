import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic } from "lucide-react";

export default function AdvancedSearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  const locations = [
    "Ooty",
    "Kodaikanal",
    "Munnar",
    "Gavi",
    "Tada",
    "Varkala",
    "Yelagiri",
    "Kotagiri",
    "Gokarna",
    "Hampi",
  ];

  const filtered =
    query.length === 0
      ? locations
      : locations.filter((l) =>
          l.toLowerCase().includes(query.toLowerCase())
        );

  /* CLOSE ON OUTSIDE CLICK */
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

  /* SUBMIT */
  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch?.({
      location,
      people: Number(people),
    });
  };

  return (
    <div className="relative z-[60] w-full">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-full shadow-xl
          px-4 py-4
          flex flex-col md:flex-row gap-4
        "
      >
        {/* LOCATION (CLICKABLE WRAPPER) */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => setShowPanel(true)}
        >
          <MapPin className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">LOCATION</p>
            <input
              value={location}
              placeholder="Select destination"
              className="text-sm outline-none cursor-pointer"
              readOnly
            />
          </div>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">DATE</p>
            <input
              type="date"
              className="text-sm outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 flex-1">
          <Users className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">NO OF MEMBERS</p>
            <input
              type="number"
              min="1"
              className="text-sm outline-none"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-3"
        >
          LET’S GO
        </button>
      </form>

      {/* LOCATION PANEL */}
      {showPanel && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/40">
          <div
            ref={panelRef}
            className="bg-white w-full md:max-w-xl rounded-t-2xl md:rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination..."
              className="w-full border p-3 rounded mb-4"
            />

            {filtered.map((l) => (
              <div
                key={l}
                onClick={() => {
                  setLocation(l);
                  setShowPanel(false);
                  setQuery("");
                }}
                className="py-3 border-b cursor-pointer hover:bg-gray-100"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
