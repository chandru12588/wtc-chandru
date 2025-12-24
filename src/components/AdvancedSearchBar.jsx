import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  const clean = v => v ? v.trim() : "";
  const cap = v => v ? v.charAt(0).toUpperCase() + v.slice(1) : "";

  /* ================== Group By States ================== */
  const states = useMemo(() => {
    const data = {};
    trips.forEach(t => {
      const state = cap(clean(t.state || t.region || "Others"));
      if (!data[state]) data[state] = { places: new Set(), types: new Set() };

      t.location && data[state].places.add(cap(t.location));
      t.category && data[state].types.add(cap(t.category));
    });
    return data;
  }, [trips]);

  /* ================== Trending from DB ================== */
  const trendingLocations = [...new Set(trips.map(t => cap(t.location)))].slice(0,8);
  const trendingTypes = [...new Set(trips.map(t => cap(t.category)))].slice(0,8);

  /* ================== Voice Search ================== */
  const voiceSearch = () => {
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    if(!SR) return alert("Voice search not supported");
    let mic = new SR();
    mic.lang="en-IN"; mic.start();
    mic.onresult = e => setSearch(e.results[0][0].transcript);
  };

  /* ================== Submit ================== */
  const submit = (e) => {
    e.preventDefault();
    onSearch?.({location:search,people});
    setOpen(false);
  };

  const clear = () => { setSearch(""); setDate(""); setPeople(""); };

  /* ================== Close on Outside Click ================== */
  useEffect(() => {
    const close = e=>{
      if(panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown",close);
    return()=>document.removeEventListener("mousedown",close);
  },[]);

  return (
    <div className="relative z-[200]">

      {/* 🔍 Main Search Bar */}
      <form onSubmit={submit}
        className="max-w-[950px] mx-auto rounded-full bg-white/60 backdrop-blur-xl shadow-xl
        flex gap-3 items-center px-4 py-3 border border-white/30">

        <div className="flex items-center gap-2 flex-1" onClick={()=>setOpen(true)}>
          <MapPin className="text-orange-600"/>
          <input
            placeholder="Search Ooty, Kodaikanal, Manali, Treehouse..."
            value={search}
            readOnly
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        <Mic size={18} onClick={voiceSearch} className="cursor-pointer text-orange-600"/>

        { (search||date||people) &&
          <button type="button" onClick={clear}
            className="p-2 rounded-full bg-gray-200"><X size={14}/></button>
        }

        <button className="px-7 py-2 bg-orange-500 text-white rounded-full text-sm font-bold">
          LET'S GO
        </button>
      </form>

      {/* 🔥 Modal Dropdown */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start p-3 z-[300]">
          <div ref={panelRef}
            className="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-bold">Search</h2>
              <X className="cursor-pointer" size={22} onClick={()=>setOpen(false)}/>
            </div>

            {/* Search box inside */}
            <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-full mb-5">
              <MapPin className="text-orange-600"/>
              <input autoFocus
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Type destination or stay type..."
                className="flex-1 bg-transparent outline-none"
              />
              <Mic className="text-orange-600 cursor-pointer" onClick={voiceSearch}/>
              {search && <X size={16} onClick={()=>setSearch("")} className="cursor-pointer"/>}
            </div>

            {/* ================== STATE SECTIONS ================== */}
            {Object.entries(states).map(([state,data])=>(
              <div key={state} className="mb-6">
                <p className="font-bold text-base">{state}</p>

                <p className="mt-2 text-xs font-semibold text-gray-500">PLACES</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[...data.places].map(p=>(
                    <Tag key={p} label={p} onClick={()=>{setSearch(p);setOpen(false)}}/>
                  ))}
                </div>

                <p className="text-xs font-semibold text-gray-500">STAY TYPES</p>
                <div className="flex flex-wrap gap-2">
                  {[...data.types].map(t=>(
                    <Tag key={t} label={t} onClick={()=>{setSearch(t);setOpen(false)}}/>
                  ))}
                </div>
              </div>
            ))}

            <p className="font-semibold mt-4">Trending Searches</p>
            <Row items={trendingTypes}/>

            <p className="font-semibold mt-4">Trending Locations</p>
            <Row items={trendingLocations}/>

          </div>
        </div>
      )}

    </div>
  );
}

const Tag = ({label,onClick})=>(
  <span onClick={onClick}
    className="px-3 py-1 bg-gray-100 text-xs rounded-full cursor-pointer hover:bg-gray-200">
    {label}
  </span>
);

const Row = ({items})=>(
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map(i=> <Tag key={i} label={i}/>)}
  </div>
);
