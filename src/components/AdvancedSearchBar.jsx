import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* ------------------ SAFE CAPITALIZE ------------------ */
  const cap = (v) =>
    typeof v === "string" && v.trim().length > 0
      ? v.charAt(0).toUpperCase() + v.slice(1)
      : "";

  /* ------------------ GROUP STATE → PLACES + TYPES ------------------ */
  const structured = useMemo(() => {
    const data = {};

    trips.forEach((t) => {
      const state = cap(t.region || "Others");
      const place = cap(t.location || "");
      const type = cap(t.category || "");

      if (!data[state]) data[state] = { places: new Set(), types: new Set() };

      if (place) data[state].places.add(place);
      if (type) data[state].types.add(type);
    });

    return data;
  }, [trips]);

  /* ------------------ TRENDING (REAL DATA ONLY) ------------------ */
  const trendingLocations = [...new Set(trips.map((t) => cap(t.location)))].filter(Boolean).slice(0, 8);
  const trendingSearches = [...new Set(trips.map((t) => cap(t.category)))].filter(Boolean).slice(0, 8);

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery("");
    setDate("");
    setPeople("");
  };

  /* ------------------ VOICE SEARCH ------------------ */
  const voice = () => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) return alert("Voice search not supported in your browser");

    const rec = new Rec();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => setQuery(e.results[0][0].transcript);
  };

  /* ------------------ CLOSE ON OUTSIDE ------------------ */
  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full">

      {/* 🔍 GLASS SEARCH BAR (Mobile + Desktop) */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-white/65 backdrop-blur-xl shadow-lg px-5 py-3 rounded-full mt-2"
      >
        <div className="flex-1 flex items-center gap-2" onClick={() => setOpen(true)}>
          <MapPin className="text-orange-600" />
          <input
            value={query}
            readOnly
            placeholder="Search Ooty, Treehouse, Manali..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <Mic size={18} onClick={voice} className="cursor-pointer text-orange-600" />

        {(query || date || people) && (
          <button
            type="button"
            onClick={clearAll}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <X size={14} />
          </button>
        )}

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-5 py-2">
          LET’S GO
        </button>
      </form>

      {/* ================= DROPDOWN MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-start p-4 z-[999]">
          <div
            ref={panelRef}
            className="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto shadow-xl"
          >
            {/* top row */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search</h2>
              <X size={24} onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            {/* inside input */}
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-full mb-6">
              <MapPin className="text-orange-600" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search place or stay type..."
                className="flex-1 bg-transparent outline-none text-sm"
              />

              <Mic size={18} onClick={voice} className="text-orange-600 cursor-pointer" />

              {query && (
                <X size={16} className="cursor-pointer" onClick={() => setQuery("")} />
              )}
            </div>

            {/* STATES LIST */}
            {Object.keys(structured).map((state) => (
              <div key={state} className="mb-6">
                <p className="font-bold text-[16px] mb-2 text-gray-800">{state}</p>

                {/* PLACES */}
                <p className="text-xs font-semibold text-gray-600">PLACES</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[...structured[state].places].map((p) => (
                    <Tag key={p} label={p} onClick={() => { setQuery(p); setOpen(false); }} />
                  ))}
                </div>

                {/* TYPES */}
                <p className="text-xs font-semibold text-gray-600">STAY TYPES</p>
                <div className="flex flex-wrap gap-2">
                  {[...structured[state].types].map((t) => (
                    <Tag key={t} label={t} onClick={() => { setQuery(t); setOpen(false); }} />
                  ))}
                </div>
              </div>
            ))}

            {/* TRENDING */}
            {trendingSearches.length > 0 && (
              <>
                <p className="font-bold mt-5">Trending Searches</p>
                <Row items={trendingSearches} />
              </>
            )}

            {trendingLocations.length > 0 && (
              <>
                <p className="font-bold mt-5">Trending Locations</p>
                <Row items={trendingLocations} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable small badge */
const Tag = ({ label, onClick }) => (
  <span
    onClick={onClick}
    className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
  >
    {label}
  </span>
);

const Row = ({ items }) => (
  <div className="flex flex-wrap gap-2 my-2">
    {items.map((i) => (
      <Tag key={i} label={i} />
    ))}
  </div>
);
