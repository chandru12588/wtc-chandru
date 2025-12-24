import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  const cap = (v) =>
    typeof v === "string" && v.trim().length > 0
      ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
      : "";

  /* =============== Group by State -> Places + Stay Types =============== */
  const grouped = useMemo(() => {
    const map = {};
    trips.forEach((t) => {
      const state = cap(t.region || "Others");
      const place = cap(t.location || "");
      const type = cap(t.category || "");

      if (!map[state]) map[state] = { places: new Set(), types: new Set() };

      if (place) map[state].places.add(place);
      if (type) map[state].types.add(type);
    });
    return map;
  }, [trips]);

  /* ============ Trending (from actual packages only) ============ */
  const trendingLocations = [...new Set(trips.map(t => cap(t.location)))].filter(Boolean).slice(0,6);
  const trendingTypes = [...new Set(trips.map(t => cap(t.category)))].filter(Boolean).slice(0,6);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery(""); setPeople(""); setDate("");
  };

  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const mic = new SR();
    mic.lang = "en-IN";
    mic.start();
    mic.onresult = (e) => setQuery(e.results[0][0].transcript);
  };

  /* close modal on outside click */
  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full z-[200]">

      {/* 🔍 Main Search Bar (Working version) */}
      <form onSubmit={handleSubmit}
        className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-full shadow-md flex items-center gap-3 px-5 py-3">
        
        <div className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}>
          <MapPin className="text-orange-500" size={18}/>
          <input readOnly value={query} placeholder="Search Ooty, Poombarai, Manali..."
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>

        <div className="flex items-center gap-2 flex-1 hidden md:flex">
          <Calendar size={18} className="text-orange-500"/>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <div className="flex items-center gap-2 flex-1 hidden md:flex">
          <Users size={18} className="text-orange-500"/>
          <input type="number" min="1" value={people} onChange={(e)=>setPeople(e.target.value)}
            placeholder="People" className="bg-transparent outline-none text-sm w-full"/>
        </div>

        {(query||date||people)&&(
          <button onClick={clearAll} type="button"
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"><X size={14}/></button>
        )}

        <button type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-6 py-2 text-sm">
          LET'S GO
        </button>
      </form>

      {/* ================= Modal Search Panel ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start p-5 z-[500] overflow-y-auto">
          <div ref={panelRef}
            className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search</h2>
              <X onClick={()=>setOpen(false)} size={22} className="cursor-pointer"/>
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4 gap-3">
              <MapPin className="text-orange-500"/>
              <input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search place or stay type..."
                className="bg-transparent outline-none text-sm w-full"/>
              <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>
              {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
            </div>

            {/* State → Places + Stay Types */}
            {Object.keys(grouped).map(state => (
              <div key={state} className="mb-6">
                <p className="font-bold text-gray-700 text-[15px]">{state}</p>

                <p className="text-xs text-gray-500 mt-1">PLACES</p>
                <Row items={[...grouped[state].places]} pick={(v)=>{setQuery(v);setOpen(false)}}/>

                <p className="text-xs text-gray-500 mt-2">STAY TYPES</p>
                <Row items={[...grouped[state].types]} pick={(v)=>{setQuery(v);setOpen(false)}}/>
              </div>
            ))}

            {trendingTypes.length>0 && (
              <>
                <p className="font-bold mt-4">Trending Searches</p>
                <Row items={trendingTypes} pick={(v)=>{setQuery(v);setOpen(false)}}/>
              </>
            )}

            {trendingLocations.length>0 && (
              <>
                <p className="font-bold mt-4">Trending Locations</p>
                <Row items={trendingLocations} pick={(v)=>{setQuery(v);setOpen(false)}}/>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

const Chip = ({text,onClick})=>(
  <span onClick={onClick}
    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs cursor-pointer">
    {text}
  </span>
);

const Row = ({items,pick})=>(
  <div className="flex flex-wrap gap-2 mt-1">
    {items.map(v=><Chip key={v} text={v} onClick={()=>pick(v)}/>)}
  </div>
);
