import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {

  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  const cap = v => typeof v === "string"
    ? v.trim().replace(/\s+/g," ").split(" ").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ")
    : "";

  /* Extract uniquely */
  const stayTypes   = [...new Set(trips.map(t=>cap(t.stayType)).filter(Boolean))];
  const categories  = [...new Set(trips.map(t=>cap(t.category)).filter(Boolean))];
  const locations   = [...new Set(trips.map(t=>cap(t.location)).filter(Boolean))];

  const trendingStay      = stayTypes.slice(0,6);
  const trendingLocation  = locations.slice(0,6);

  /* Search Submit */
  const handleSubmit = e => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = ()=>{ setQuery(""); setDate(""); setPeople(""); };

  /* Voice Search */
  const voice = ()=>{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return alert("Voice not supported");
    const mic = new SR();
    mic.lang="en-IN";
    mic.start();
    mic.onresult = e => setQuery(e.results[0][0].transcript);
  };

  useEffect(()=>{
    const close = e=>{
      if(panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown",close);
    return()=>document.removeEventListener("mousedown",close);
  },[]);

  return (
    <div className="relative w-full">

      {/* TOP SEARCH BAR */}
      <form onSubmit={handleSubmit}
        className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-full shadow-md flex items-center gap-4 px-5 py-3">

        <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={()=>setOpen(true)}>
          <MapPin className="text-orange-500" size={18}/>
          <input readOnly value={query} placeholder="Search Location or Stay Type..."
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500"/>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <Users size={18} className="text-orange-500"/>
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
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-2 text-sm font-bold">
          LET'S GO
        </button>
      </form>

      {/* SEARCH MODAL */}
      {open &&(
      <div className="fixed inset-0 bg-black/30 flex justify-center items-start p-6 z-[500] overflow-y-auto">
        <div ref={panelRef} className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <X className="cursor-pointer" size={22} onClick={()=>setOpen(false)}/>
          </div>

          {/* Input */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-6 gap-3">
            <MapPin className="text-orange-500"/>
            <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="Search Location or Stay Type..."
              className="bg-transparent outline-none text-sm w-full"/>
            <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>
            {query&&<X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
          </div>

          {/* Sections */}
          <Section title="Stay Types"     data={stayTypes}     pick={v=>{setQuery(v);setOpen(false)}}/>
          <Section title="Categories"     data={categories}    pick={v=>{setQuery(v);setOpen(false)}}/>
          <Section title="Locations"      data={locations}     pick={v=>{setQuery(v);setOpen(false)}}/>

          {trendingStay.length>0      && <Section title="🔥 Trending Stays"      data={trendingStay} pick={v=>{setQuery(v);setOpen(false)}}/>}
          {trendingLocation.length>0  && <Section title="📍 Trending Locations" data={trendingLocation} pick={v=>{setQuery(v);setOpen(false)}}/>}

        </div>
      </div>
      )}

    </div>
  );
}

const Section = ({title,data,pick})=>(
  <div className="mt-6">
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {data.map(v=>(
        <span key={v} onClick={()=>pick(v)}
          className="px-3 py-1 bg-gray-100 hover:bg-orange-200 rounded-full text-xs cursor-pointer transition">
          {v}
        </span>
      ))}
    </div>
  </div>
);
