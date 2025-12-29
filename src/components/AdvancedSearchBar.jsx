// frontend/src/components/AdvancedSearchBar.jsx

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {

  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  // Format string into Proper Case
  const format = (v) =>
    typeof v === "string"
      ? v.trim().split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "";

  /* ============ Auto fetch unique values ============ */
  const stayTypes  = [...new Set(trips.map(t => format(t.stayType)).filter(Boolean))];
  const categories = [...new Set(trips.map(t => format(t.category)).filter(Boolean))];
  const locations  = [...new Set(trips.map(t => format(t.location)).filter(Boolean))];

  const trendingStays = stayTypes.slice(0,6);
  const trendingLocations = locations.slice(0,6);

  /* ============ Search Submit ============ */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = ()=>{ setQuery(""); setDate(""); setPeople(""); };

  /* ============ Voice Search ============ */
  const voice = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return alert("Voice not supported");
    const mic = new SR();
    mic.lang="en-IN";
    mic.start();
    mic.onresult = e => setQuery(e.results[0][0].transcript);
  };

  /* Close filter popup when clicked outside */
  useEffect(()=>{
    const close = e=>{
      if(panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown",close);
    return()=>document.removeEventListener("mousedown",close);
  },[]);

  return (
    <div className="relative w-full z-[200]">

      {/* 🔍 TOP MAIN SEARCH BAR */}
      <form onSubmit={handleSubmit}
        className="w-full bg-white/70 backdrop-blur-xl rounded-full shadow-md flex items-center gap-3 px-5 py-3">

        <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={()=>setOpen(true)}>
          <MapPin size={18} className="text-orange-600"/>
          <input readOnly value={query} placeholder="Search Stay Type or City..."
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-600"/>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <Users size={18} className="text-orange-600"/>
          <input type="number" min="1" value={people} placeholder="People"
            onChange={e=>setPeople(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        {(query||date||people)&&(
          <button type="button" onClick={clearAll}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <X size={14}/>
          </button>
        )}

        <button type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-6 py-2 text-sm">
          LET'S GO
        </button>
      </form>


      {/* ================= SCROLLABLE CATEGORY BAR ================= */}
      <div className="mt-5 flex gap-3 overflow-x-auto scrollbar-hide py-2 px-2">

        {/* Stay Types */}
        {stayTypes.map((v,i)=>(
          <button key={i}
            onClick={()=>{ setQuery(v); onSearch({location:v}); }}
            className="min-w-[90px] flex flex-col items-center justify-center 
            px-4 py-3 rounded-2xl bg-white border text-xs hover:bg-orange-50 
            shadow-sm">
            🏡 <span className="mt-1">{v}</span>
          </button>
        ))}

        {/* Locations */}
        {locations.map((v,i)=>(
          <button key={i}
            onClick={()=>{ setQuery(v); onSearch({location:v}); }}
            className="min-w-[90px] flex flex-col items-center justify-center 
            px-4 py-3 rounded-2xl bg-white border text-xs hover:bg-orange-50 
            shadow-sm">
            📍 <span className="mt-1">{v}</span>
          </button>
        ))}

        {/* Categories */}
        {categories.map((v,i)=>(
          <button key={i}
            onClick={()=>{ setQuery(v); onSearch({location:v}); }}
            className="min-w-[90px] flex flex-col items-center justify-center 
            px-4 py-3 rounded-2xl bg-white border text-xs hover:bg-orange-50 
            shadow-sm">
            🎒 <span className="mt-1">{v}</span>
          </button>
        ))}

        {/* FILTER BUTTON (OPEN POPUP) */}
        <button 
          onClick={() => setOpen(true)}
          className="min-w-[90px] flex flex-col justify-center items-center 
          bg-gray-200 hover:bg-gray-300 rounded-2xl px-4 py-4 shadow">
          ⚙️ <span className="text-xs font-semibold mt-1">Filter</span>
        </button>
      </div>


      {/* ================= POPUP FILTER PANEL ================= */}
      {open&&(
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start p-5 z-[500] overflow-y-auto">
          <div ref={panelRef}
            className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[82vh] p-6 overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search Filters</h2>
              <X size={22} className="cursor-pointer" onClick={()=>setOpen(false)}/>
            </div>

            {/* Search Input inside popup */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4 gap-3">
              <MapPin className="text-orange-600"/>
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Search location or stay type..."
                className="bg-transparent outline-none text-sm w-full"/>
              <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>
              {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
            </div>

            {/* Filters inside modal */}
            <Section title="🏡 Stay Types" data={stayTypes} pick={v=>{setQuery(v);setOpen(false)}}/>
            <Section title="📍 Locations" data={locations} pick={v=>{setQuery(v);setOpen(false)}}/>
            <Section title="🎒 Categories" data={categories} pick={v=>{setQuery(v);setOpen(false)}}/>

            {trendingStays.length>0 && <Section title="🔥 Popular Stays" data={trendingStays} pick={v=>{setQuery(v);setOpen(false)}}/>}
            {trendingLocations.length>0 && <Section title="✨ Hot Locations" data={trendingLocations} pick={v=>{setQuery(v);setOpen(false)}}/>}
          </div>
        </div>
      )}
    </div>
  );
}

/* Chip Reusable Section */
const Section = ({title,data,pick})=>(
  <div className="mt-5">
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {data.map(v=>(
        <span key={v} onClick={()=>pick(v)}
          className="px-3 py-1 bg-gray-100 hover:bg-orange-300 rounded-full text-[11px] cursor-pointer transition">
          {v}
        </span>
      ))}
    </div>
  </div>
);
