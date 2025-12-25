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
      ? v.charAt(0).toUpperCase() + v.slice(1)
      : "";

  /* -------- Extract Clean Lists -------- */
  const stayTypes = [...new Set(trips.map(t => cap(t.stayType)).filter(Boolean))];
  const categories = [...new Set(trips.map(t => cap(t.category)).filter(Boolean))];
  const locations = [...new Set(trips.map(t => cap(t.location)).filter(Boolean))];

  /* trending top 6 each */
  const trendingStay = stayTypes.slice(0,6);
  const trendingLocations = locations.slice(0,6);

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

  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full z-[200]">

      {/* TOP SEARCH BAR */}
      <form onSubmit={handleSubmit}
        className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-full shadow-md flex items-center gap-3 px-5 py-3">
        
        <div className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}>
          <MapPin className="text-orange-500" size={18}/>
          <input readOnly value={query} placeholder="Search Ooty, Kodaikanal, Stay Type..."
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500"/>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1">
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


      {/* ================= MODAL SEARCH PANEL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start p-5 z-[500] overflow-y-auto">
          <div ref={panelRef}
            className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search</h2>
              <X onClick={()=>setOpen(false)} size={22} className="cursor-pointer"/>
            </div>

            {/* Search Field */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4 gap-3">
              <MapPin className="text-orange-500"/>
              <input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search location or stay type..."
                className="bg-transparent outline-none text-sm w-full"/>
              <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>
              {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
            </div>

            {/* ========= STAY TYPE SECTION ========= */}
            <h3 className="font-bold text-gray-800 mt-3 mb-1">Stay Types</h3>
            <Row items={stayTypes} pick={(v)=>{setQuery(v);setOpen(false)}}/>

            {/* ========= CATEGORY SECTION ========= */}
            <h3 className="font-bold text-gray-800 mt-5 mb-1">Categories</h3>
            <Row items={categories} pick={(v)=>{setQuery(v);setOpen(false)}}/>

            {/* ========= LOCATION SECTION ========= */}
            <h3 className="font-bold text-gray-800 mt-5 mb-1">Locations</h3>
            <Row items={locations} pick={(v)=>{setQuery(v);setOpen(false)}}/>

            {/* -------- Trending -------- */}
            {trendingStay.length>0 && (
              <>
                <h3 className="font-bold mt-6 mb-1 text-orange-700">Trending Stays</h3>
                <Row items={trendingStay} pick={(v)=>{setQuery(v);setOpen(false)}}/>
              </>
            )}

            {trendingLocations.length>0 && (
              <>
                <h3 className="font-bold mt-6 mb-1 text-orange-700">Trending Locations</h3>
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
