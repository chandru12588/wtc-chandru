import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  /* ---------------- Generate Dynamic Suggestions ----------------*/
  const formatted = useMemo(() => {
    let setLoc = new Set();
    let setSearch = new Set();

    trips.forEach((t) => {
      if (t.location) setLoc.add(t.location);
      if (t.region) setLoc.add(t.region);
      if (t.category) setSearch.add(t.category);
      if (t.title) setSearch.add(t.title);
    });

    return {
      trendingSearch: Array.from(setSearch).slice(0, 10),
      trendingLocations: Array.from(setLoc).slice(0, 12),
      allList: Array.from(new Set([...setSearch, ...setLoc])),
    };
  }, [trips]);

  const results = query
    ? formatted.allList.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : formatted.allList;

  /* ---------------- Voice Search ----------------*/
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => {
      setQuery(e.results[0][0].transcript);
      setOpen(true);
    };
  };

  /* ---------------- Submit ----------------*/
  const searchNow = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  /* ---------------- Clear ----------------*/
  const clear = () => {
    setQuery("");
    setPeople("");
    setDate("");
    onSearch?.({ location: "", people: "" });
  };

  /* ---------------- Outside Close ----------------*/
  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full">

      {/* ================= Search Bar ================= */}
      <form
        onSubmit={searchNow}
        className="
          w-full max-w-6xl mx-auto rounded-full shadow-xl 
          bg-white/60 backdrop-blur-md border border-white/30
          px-6 py-3 flex items-center flex-wrap gap-3
        "
      >
        {/* Location */}
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="text-orange-500" size={18} />
          <input
            value={query}
            onChange={(e)=>{setQuery(e.target.value); setOpen(true)}}
            onFocus={()=>setOpen(true)}
            placeholder="Search: Ooty, Tree House, Dome, Mudhouse…"
            className="w-full bg-transparent text-sm outline-none"
          />
          <Mic size={18} className="text-orange-600 cursor-pointer" onClick={startVoice} />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 flex-1 min-w-[150px]">
          <Calendar className="text-orange-500" size={18}/>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"/>
        </div>

        {/* People */}
        <div className="flex items-center gap-2 flex-1 min-w-[120px]">
          <Users className="text-orange-500" size={18}/>
          <input type="number" min="1" placeholder="People"
            value={people} onChange={(e)=>setPeople(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"/>
        </div>

        {/* Buttons */}
        {(query || date || people) && (
          <button type="button" onClick={clear}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <X size={14}/>
          </button>
        )}

        <button type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-2">
          LET'S GO
        </button>
      </form>


      {/* ================= Dropdown Panel Like Exotic ================= */}
      {open && (
        <div className="absolute w-full flex justify-center mt-4 z-[9999]">
          <div ref={panelRef}
            className="
              w-full max-w-4xl bg-white p-6 rounded-2xl shadow-2xl
              max-h-[55vh] overflow-y-auto border border-gray-100
            "
          >
            {/* Search box inside dropdown */}
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Enter destination"
              className="w-full p-3 border rounded-lg mb-4"
            />

            {/* Trending Searches */}
            <h3 className="font-semibold mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {formatted.trendingSearch.map((item)=>(
                <span key={item}
                  className="px-4 py-2 text-sm rounded-full border cursor-pointer hover:bg-orange-50"
                  onClick={()=>{setQuery(item); setOpen(false)}}
                >{item}</span>
              ))}
            </div>

            {/* Trending Locations */}
            <h3 className="font-semibold mb-2">Trending Locations</h3>
            <div className="flex flex-wrap gap-2">
              {formatted.trendingLocations.map((item)=>(
                <span key={item}
                  className="px-4 py-2 text-sm rounded-full border cursor-pointer hover:bg-orange-50"
                  onClick={()=>{setQuery(item); setOpen(false)}}
                >{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
