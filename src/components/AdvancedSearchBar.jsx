import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* Safe Capitalize */
  const cap = (v) =>
    typeof v === "string" && v.trim()
      ? v.charAt(0).toUpperCase() + v.slice(1)
      : "";

  /* Group by State -> Places + Types */
  const structured = useMemo(() => {
    const data = {};
    trips.forEach((t) => {
      const state = cap(t.region || t.state || "Others");
      const place = cap(t.location || "");
      const type = cap(t.category || "");

      if (!data[state]) data[state] = { places: new Set(), types: new Set() };
      if (place) data[state].places.add(place);
      if (type) data[state].types.add(type);
    });
    return data;
  }, [trips]);

  const trendingLocations = [...new Set(trips.map(t => cap(t.location)))].filter(Boolean).slice(0,8);
  const trendingTypes = [...new Set(trips.map(t => cap(t.category)))].filter(Boolean).slice(0,8);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery(""); setDate(""); setPeople("");
  };

  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const mic = new SR();
    mic.lang = "en-IN"; mic.start();
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
    <div className="relative w-full flex justify-center">

      {/* 🔍 Main Search Bar (Glass UI like your screenshot) */}
      <form
        onSubmit={handleSubmit}
        className="w-[95%] max-w-[1050px] bg-white/65 backdrop-blur-xl shadow-lg rounded-full flex items-center gap-4 py-4 px-6 mt-3"
      >
        {/* LOCATION */}
        <div className="flex flex-col flex-1 cursor-pointer" onClick={()=>setOpen(true)}>
          <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1">
            <MapPin className="text-orange-500" size={16}/> LOCATION
          </label>
          <input readOnly value={query} placeholder="Enter the Destination"
            className="outline-none text-sm bg-transparent"/>
        </div>

        <div className="hidden md:flex flex-col border-l pl-6 flex-1">
          <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1">
            <Calendar className="text-orange-500" size={16}/> DATE
          </label>
          <input type="date" value={date}
            onChange={e=>setDate(e.target.value)}
            className="outline-none text-sm mt-1"/>
        </div>

        <div className="hidden md:flex flex-col border-l pl-6 flex-1">
          <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1">
            <Users className="text-orange-500" size={16}/> NO OF MEMBERS
          </label>
          <input type="number" placeholder="How many People?" min="1"
            value={people} onChange={e=>setPeople(e.target.value)}
            className="outline-none text-sm mt-1"/>
        </div>

        <Mic size={20} onClick={voice} className="cursor-pointer text-orange-600"/>

        {(query||date||people)&&(
          <button type="button" onClick={clearAll}
            className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"><X size={14}/></button>
        )}

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-7 py-2">
          LET'S GO
        </button>
      </form>

      {/* 🔥 FULL Responsive Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/35 z-[9999] backdrop-blur-sm flex justify-center pt-28 px-3 md:pt-36">
          <div ref={panelRef}
            className="w-full max-w-[900px] bg-white rounded-2xl shadow-2xl p-5 md:p-7
                       max-h-[80vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-white pb-2 z-50">
              <h2 className="text-lg font-bold">Search</h2>
              <X onClick={()=>setOpen(false)} size={28} className="cursor-pointer"/>
            </div>

            {/* Search Input inside modal */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 mb-5 sticky top-10 z-50">
              <MapPin className="text-orange-600"/>
              <input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search place or stay type..."
                className="flex-1 outline-none bg-transparent text-sm"/>
              <Mic className="text-orange-600 cursor-pointer" size={18} onClick={voice}/>
              {query && <X size={16} onClick={()=>setQuery("")} className="cursor-pointer"/>}
            </div>

            {/* STATES DISPLAY */}
            {Object.keys(structured).map(state => (
              <div key={state} className="mb-6">
                <p className="font-bold text-gray-800 text-[16px]">{state}</p>

                <p className="text-xs mt-2 text-gray-600">PLACES</p>
                <Row items={[...structured[state].places]} pick={v=>{setQuery(v);setOpen(false)}}/>

                <p className="text-xs mt-2 text-gray-600">STAY TYPES</p>
                <Row items={[...structured[state].types]} pick={v=>{setQuery(v);setOpen(false)}}/>
              </div>
            ))}

            {trendingTypes.length>0 && (
              <>
                <p className="font-bold mt-5">Trending Searches</p>
                <Row items={trendingTypes} pick={v=>{setQuery(v);setOpen(false)}}/>
              </>
            )}

            {trendingLocations.length>0 && (
              <>
                <p className="font-bold mt-5">Trending Locations</p>
                <Row items={trendingLocations} pick={v=>{setQuery(v);setOpen(false)}}/>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Tag Reusable */
const Tag = ({label,onClick})=>(
  <span onClick={onClick}
    className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200">
    {label}
  </span>
);

/* Row */
const Row = ({items,pick})=>(
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map(i=> <Tag key={i} label={i} onClick={()=>pick(i)}/>)}
  </div>
);
