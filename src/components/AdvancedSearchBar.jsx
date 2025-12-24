import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const modalRef = useRef(null);
  const cap = (v) => v?.charAt(0).toUpperCase() + v.slice(1).toLowerCase();

  /* -------------------- Group State → Places + Stay Types -------------------- */
  const grouped = useMemo(() => {
    const data = {};
    trips.forEach(p => {
      const state = cap(p.region || p.state || "Others");
      if (!data[state]) data[state] = { places: new Set(), types: new Set() };

      p.location && data[state].places.add(cap(p.location));
      p.category && data[state].types.add(cap(p.category));
    });
    return data;
  }, [trips]);

  const trendingLocations = [...new Set(trips.map(p => cap(p.location)))].slice(0,8);
  const trendingTypes = [...new Set(trips.map(p => cap(p.category)))].slice(0,8);

  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported on this device");
    let mic = new SR();
    mic.lang = "en-IN"; mic.start();
    mic.onresult = e => setQuery(e.results[0][0].transcript);
  };

  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = () => { setQuery(""); setDate(""); setPeople(""); };

  useEffect(() => {
    const click = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div className="relative w-full flex justify-center">

      {/* ============ SAME UI LIKE YOUR SCREENSHOT ============ */}
      <form
        onSubmit={submit}
        className="w-[95%] max-w-[1050px] bg-white shadow-xl rounded-full flex items-center gap-2 py-4 px-6"
      >

        {/* LOCATION */}
        <div className="flex flex-col flex-1 cursor-pointer" onClick={()=>setOpen(true)}>
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <MapPin className="text-orange-500" size={18}/> LOCATION
          </label>
          <input
            readOnly value={query}
            placeholder="Enter the Destination"
            className="outline-none text-[13px] mt-1"
          />
        </div>

        {/* DATE */}
        <div className="flex flex-col flex-1 border-l pl-6">
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <Calendar className="text-orange-500" size={18}/> DATE
          </label>
          <input type="date" value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="outline-none text-[13px] mt-1"
          />
        </div>

        {/* MEMBERS */}
        <div className="flex flex-col flex-1 border-l pl-6">
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <Users className="text-orange-500" size={18}/> NO OF MEMBERS
          </label>
          <input type="number" min="1" value={people}
            onChange={(e)=>setPeople(e.target.value)}
            className="outline-none text-[13px] mt-1"
            placeholder="How many People?"
          />
        </div>

        {/* Voice */}
        <Mic size={20} onClick={voice} className="cursor-pointer text-orange-600 mx-2"/>

        {/* Submit */}
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-bold rounded-full px-7 py-2">
          LET'S GO
        </button>
      </form>


      {/* ================= DROPDOWN MODEL SMALL & CLEAN ================= */}
      {open && (
        <div ref={modalRef} className="
          absolute top-[90px] w-[90%] max-w-[900px] p-5 bg-white rounded-2xl shadow-2xl 
          max-h-[70vh] overflow-y-auto
        ">
          {/* Input inside modal */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-5">
            <MapPin className="text-orange-600"/>
            <input autoFocus className="flex-1 bg-transparent outline-none"
              placeholder="Search place or stay type..."
              value={query} onChange={(e)=>setQuery(e.target.value)}
            />
            <Mic className="text-orange-600 cursor-pointer" size={18} onClick={voice}/>
            {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
          </div>

          {/* STATE WISE LIST */}
          {Object.entries(grouped).map(([state,data])=>(
            <div key={state} className="mb-6">
              <p className="font-bold">{state}</p>

              <p className="text-xs text-gray-500 mt-2">PLACES</p>
              <Row items={[...data.places]} pick={(v)=>{setQuery(v);setOpen(false)}}/>

              <p className="text-xs text-gray-500 mt-2">STAY TYPES</p>
              <Row items={[...data.types]} pick={(v)=>{setQuery(v);setOpen(false)}}/>
            </div>
          ))}

          <p className="font-bold mt-4">TRENDING LOCATIONS</p>
          <Row items={trendingLocations} pick={v=>{setQuery(v);setOpen(false)}}/>

          <p className="font-bold mt-4">TRENDING STAY TYPES</p>
          <Row items={trendingTypes} pick={v=>{setQuery(v);setOpen(false)}}/>
        </div>
      )}
    </div>
  );
}


/* Small Chip */
const Row = ({items,pick}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map(v=>(
      <span key={v} onClick={()=>pick(v)}
        className="px-3 py-1 bg-gray-100 rounded-full text-xs cursor-pointer hover:bg-gray-200">
        {v}
      </span>
    ))}
  </div>
);
