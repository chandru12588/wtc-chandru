// ================= AdvancedSearchBar.jsx ==================

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X, Search } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* ================= GROUP DATA ================= */
  const grouped = useMemo(() => {
    const state = {};
    const stayType = new Set();

    trips.forEach(t => {
      if (t.category) stayType.add(t.category);

      if (!state[t.state]) state[t.state] = new Set();

      if (t.location) state[t.state].add(t.location);
      if (t.region) state[t.state].add(t.region);
      if (t.title) state[t.state].add(t.title);
    });

    return { state, stayType: [...stayType] };
  }, [trips]);

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

  /* Voice Search */
  const startVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => setQuery(e.results[0][0].transcript);
  };

  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative z-[200]">

      {/* TOP GLASS BAR */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl shadow-lg rounded-full flex items-center px-4 py-3 gap-3 
        max-w-6xl mx-auto w-full border border-white/30 text-sm"
      >
        {/* Search */}
        <div
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 flex-1 cursor-pointer"
        >
          <Search size={18} className="text-orange-500"/>
          <input value={query} readOnly placeholder="Search Ooty, Tree House..." 
          className="bg-transparent outline-none w-full"/>
        </div>

        <Calendar size={18} className="text-orange-500"/>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-transparent"/>

        <Users size={18} className="text-orange-500"/>
        <input type="number" value={people} onChange={e=>setPeople(e.target.value)} placeholder="People"
        className="bg-transparent w-14"/>

        {(query||date||people)&&(
          <button type="button" onClick={clearAll} className="bg-gray-200 p-2 rounded-full">
            <X size={14}/>
          </button>
        )}

        <button className="bg-orange-500 text-white px-6 py-2 rounded-full">LET'S GO</button>
      </form>


      {/* MODAL POPUP */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-[999] overflow-y-auto">

          <div ref={panelRef} className="bg-white w-full max-w-4xl rounded-3xl p-6 shadow-xl">

            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg">Search</h2>

              <div className="flex gap-2">
                <button onClick={clearAll} className="p-2 bg-gray-100 rounded-full"><X size={16}/></button>
                <button onClick={()=>setOpen(false)} className="p-2 bg-gray-200 rounded-full"><X/></button>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
              <MapPin size={18} className="text-orange-500"/>
              <input autoFocus placeholder="Type place or stay type..."
               value={query} onChange={e=>setQuery(e.target.value)} 
               className="bg-transparent w-full outline-none ml-2"/>
              <Mic onClick={startVoiceSearch} className="text-orange-500 cursor-pointer"/>
            </div>


            {/* STATE WISE LOCATIONS */}
            {Object.keys(grouped.state).map(s=>(
              <div key={s} className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">{s}</h3>
                <div className="flex flex-wrap gap-2">
                  {[...grouped.state[s]].map(loc=>(
                    <button key={loc} onClick={()=>setQuery(loc)}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-orange-100">
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* STAY TYPES */}
            <h3 className="font-semibold text-gray-700 mb-2">Stay Type</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {grouped.stayType.map(type=>(
                <button key={type} onClick={()=>setQuery(type)}
                className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200">
                  {type}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
