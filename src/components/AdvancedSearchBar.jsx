import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* 🔥 GROUP STATE → PLACES + STAY TYPES */
  const structured = useMemo(() => {
    const data = {};
    trips.forEach(t => {
      const state = cap(t.region || "Others");
      if (!data[state]) data[state] = { places: new Set(), types: new Set() };

      if (t.location) data[state].places.add(cap(t.location));
      if (t.category) data[state].types.add(cap(t.category));
    });
    return data;
  }, [trips]);

  const TrendingLocations = [...new Set(trips.map(t => cap(t.location)))].slice(0, 10); // city only
  const handleSubmit = e => { e.preventDefault(); onSearch({ location: query, people }); setOpen(false); };
  
  const clearAll = () => { setQuery(""); setPeople(""); setDate(""); };

  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice search not supported");
    const r = new SR(); r.lang = "en-IN"; r.start();
    r.onresult = e => setQuery(e.results[0][0].transcript);
  };

  /* === CLOSE WHEN CLICK OUTSIDE === */
  useEffect(() => {
    const close = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full">

      {/** TOP SEARCH BAR UI - SAME LIKE DESIGN **/}
      <form onSubmit={handleSubmit}
        className="flex items-center bg-white/80 backdrop-blur-xl shadow-xl rounded-full px-6 py-3 w-full max-w-6xl mx-auto gap-4 border">

        <div className="flex-1 flex items-center gap-2" onClick={() => setOpen(true)}>
          <MapPin className="text-orange-600"/>
          <input className="bg-transparent outline-none text-sm w-full"
           placeholder="Search Ooty, Kodaikanal, Tent stay..."
           value={query} readOnly />
        </div>

        <Mic className="text-orange-600 cursor-pointer" onClick={voice} />

        {(query || date || people) && (
          <button type="button" className="p-2 bg-gray-200 rounded-full"
            onClick={clearAll}><X size={14}/></button>
        )}

        <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2">
          LET'S GO
        </button>
      </form>

      {/* ================= MODAL =============== */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-20 z-[999] px-3">
          <div ref={panelRef}
            className="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[70vh] overflow-y-auto shadow-2xl">

            {/* Header row */}
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-lg">Search</h2>
              <X size={22} className="cursor-pointer" onClick={() => setOpen(false)}/>
            </div>

            {/* Input inside popup */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-5 gap-2">
              <MapPin className="text-orange-600"/>
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Type place or stay type..." className="bg-transparent outline-none w-full"/>
              <Mic className="text-orange-600 cursor-pointer" onClick={voice}/>
              {query && <X size={16} onClick={()=>setQuery("")} className="cursor-pointer"/>}
            </div>

            {/* STATE / PLACES / STAY TYPES */}
            {Object.keys(structured).map(state => (
              <div key={state} className="mb-6">
                <p className="font-bold text-gray-900">{state}</p>

                <p className="font-semibold text-xs mt-2">PLACES</p>
                <Row items={[...structured[state].places]} set={setQuery} close={setOpen} />

                <p className="font-semibold text-xs mt-2">STAY TYPES</p>
                <Row items={[...structured[state].types]} set={setQuery} close={setOpen} />
              </div>
            ))}

            {/* Trending only City Names */}
            <p className="font-semibold text-sm mt-6">Trending Locations</p>
            <Row items={TrendingLocations} set={setQuery} close={setOpen}/>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({items,set,close}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-2">
      {items.map(v=>(
        <span key={v}
          onClick={()=>{set(v); close(false);}}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-full text-xs">
          {v}
        </span>
      ))}
    </div>
  );
}

const cap = v => v ? v.charAt(0).toUpperCase()+v.slice(1).toLowerCase() : "";
