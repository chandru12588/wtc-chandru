import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* 🟢 Normalize state names & group -> State : { places[], types[] } */
  const structured = useMemo(() => {
    const data = {};

    trips.forEach(t => {
      let state = (t.region || "Others").trim().toLowerCase();
      state = state.replace(/\s+/g, " ");                        // Remove duplicate spacing
      state = state[0].toUpperCase() + state.slice(1);           // Capitalize

      if (!data[state]) data[state] = { places: new Set(), types: new Set() };

      if (t.location) data[state].places.add(cap(t.location));
      if (t.category) data[state].types.add(cap(t.category));
    });

    return data;
  }, [trips]);

  function cap(v) { return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(); }

  /* 🚀 Trending based on first 8 unique */
  const trendingPlaces = [...new Set(trips.map(t => cap(t.location)))].slice(0, 8);
  const trendingSearches = [...new Set(trips.map(t => cap(t.category)))].slice(0, 8);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery(""); setDate(""); setPeople("");
  };

  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice search unavailable");
    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = e => setQuery(e.results[0][0].transcript);
  };

  /* Close modal on outside click */
  useEffect(() => {
    const close = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full">

      {/* 🔍 Top Search Bar */}
      <form onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-white/70 backdrop-blur-xl px-4 py-3 rounded-full shadow-lg">

        <div className="flex-1 flex items-center gap-2" onClick={()=>setOpen(true)}>
          <MapPin className="text-orange-600"/>
          <input readOnly placeholder="Search Ooty, Treehouse, Manali..."
            value={query} className="w-full bg-transparent outline-none"/>
        </div>

        <Mic onClick={voice} className="text-orange-600 cursor-pointer"/>

        {(query||date||people)&&(
          <button type="button" onClick={clearAll}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"><X size={14}/></button>
        )}

        <button className="bg-orange-500 text-white rounded-full px-6 py-2">LET'S GO</button>
      </form>

      {/* 📌 MODAL DROPDOWN */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start p-4 z-[999]">
          <div ref={panelRef}
            className="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-bold">Search</h2>
              <X size={22} className="cursor-pointer" onClick={()=>setOpen(false)}/>
            </div>

            {/* Input inside */}
            <div className="flex items-center bg-gray-100 rounded-full p-3 mb-5 gap-2">
              <MapPin className="text-orange-600"/>
              <input autoFocus placeholder="Search place or stay type..."
                value={query} onChange={e=>setQuery(e.target.value)}
                className="w-full outline-none"/>
              <Mic onClick={voice} className="text-orange-600 cursor-pointer"/>
              {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
            </div>

            {/* 🏞 State wise grouping */}
            {Object.keys(structured).map(state => (
              <div key={state} className="mb-6">
                <p className="font-bold text-gray-800 text-[16px]">{state.toUpperCase()}</p>

                <p className="mt-2 text-xs font-semibold">PLACES</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[...structured[state].places].map(p=>(
                    <Tag key={p} label={p} onClick={()=>{setQuery(p);setOpen(false)}}/>
                  ))}
                </div>

                <p className="text-xs font-semibold">STAY TYPES</p>
                <div className="flex flex-wrap gap-2">
                  {[...structured[state].types].map(t=>(
                    <Tag key={t} label={t} onClick={()=>{setQuery(t);setOpen(false)}}/>
                  ))}
                </div>
              </div>
            ))}

            {/* Trending Sections */}
            {!!trendingSearches.length && (
              <>
                <p className="font-semibold mt-6 text-[15px]">TRENDING SEARCHES</p>
                <Row items={trendingSearches}/>
              </>
            )}

            {!!trendingPlaces.length && (
              <>
                <p className="font-semibold mt-4 text-[15px]">TRENDING LOCATIONS</p>
                <Row items={trendingPlaces}/>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

/* small UI reusable */
const Tag = ({label,onClick}) => (
  <span onClick={onClick}
    className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
    {label}
  </span>
);

const Row = ({items}) => (
  <div className="flex flex-wrap gap-2 my-2">
    {items.map(i=><Tag key={i} label={i}/>)}
  </div>
);
