import React, { useState, useMemo, useRef, useEffect } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const grouped = useMemo(() => {
    const data = {};
    trips.forEach(t => {
      const state = cap(t.region || "Others");
      if (!data[state]) data[state] = { places: new Set(), types: new Set() };
      if (t.location) data[state].places.add(cap(t.location));
      if (t.category) data[state].types.add(cap(t.category));
    });
    return data;
  }, [trips]);

  const TrendingLocations = [...new Set(trips.map(t => cap(t.location)))].slice(0, 10);

  const voiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = e => setQuery(e.results[0][0].transcript);
  };

  const submit = e => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery(""); setDate(""); setPeople("");
  };

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full flex flex-col items-center relative">

      {/* TOP SEARCH BAR EXACT LIKE SCREENSHOT */}
      <form onSubmit={submit}
        ref={ref}
        className="flex items-center w-full max-w-6xl rounded-full overflow-hidden bg-white shadow-xl border">

        {/* Location */}
        <div className="flex flex-1 items-center gap-3 px-4 py-3 cursor-pointer border-r"
             onClick={() => setOpen(!open)}>
          <MapPin className="text-orange-600"/>
          <input
            value={query}
            readOnly
            placeholder="Enter the Destination"
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        {/* Date */}
        <div className="flex flex-1 gap-3 items-center px-4 py-3 border-r">
          <Calendar className="text-orange-600"/>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        {/* People */}
        <div className="flex flex-1 gap-3 items-center px-4 py-3 border-r">
          <Users className="text-orange-600"/>
          <input type="number" min="1" value={people}
            onChange={e=>setPeople(e.target.value)}
            placeholder="How many People?"
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        {query && (
          <button type="button" onClick={clearAll}
            className="px-3"><X size={16}/></button>
        )}

        <Mic onClick={voiceSearch} className="mr-3 text-orange-600 cursor-pointer"/>

        <button className="bg-orange-500 text-white px-8 py-3 font-semibold">
          LET'S GO
        </button>
      </form>

      {/* 🔽 DROPDOWN (NOT FULL SCREEN) */}
      {open && (
        <div className="w-full max-w-6xl mt-3 rounded-2xl shadow-xl bg-white p-5 max-h-[350px] overflow-y-auto absolute top-[75px] z-[200]">

          <input autoFocus
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search place or stay type..."
            className="w-full p-3 mb-4 bg-gray-100 rounded-xl"/>

          {Object.keys(grouped).map(state => (
            <div key={state} className="mb-4">
              <h3 className="font-bold text-gray-800">{state}</h3>

              <p className="text-xs font-semibold mt-1">PLACES</p>
              <Row list={[...grouped[state].places]} onSelect={v=>{setQuery(v);setOpen(false)}}/>

              <p className="text-xs font-semibold mt-2">STAY TYPES</p>
              <Row list={[...grouped[state].types]} onSelect={v=>{setQuery(v);setOpen(false)}}/>
            </div>
          ))}

          <p className="font-semibold mt-4">Trending Locations</p>
          <Row list={TrendingLocations} onSelect={v=>{setQuery(v);setOpen(false)}}/>

        </div>
      )}
    </div>
  );
}

const Row = ({list,onSelect}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {list.map(v=>(
      <span key={v}
        onClick={()=>onSelect(v)}
        className="px-3 py-1 text-xs bg-gray-100 rounded-full cursor-pointer hover:bg-orange-200">
        {v}
      </span>
    ))}
  </div>
);

const cap = s => s ? s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():"";
