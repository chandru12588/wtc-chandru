import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const modalRef = useRef(null);
  const cap = (v) => v?.charAt(0).toUpperCase() + v.slice(1).toLowerCase();

  /* ---------- Group packages ---------- */
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
  const trendingTypes     = [...new Set(trips.map(p => cap(p.category)))].slice(0,8);

  /* ---------- Voice Search ---------- */
  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    let mic = new SR();
    mic.lang = "en-IN";
    mic.start();
    mic.onresult = e => setQuery(e.results[0][0].transcript);
  };

  /* ---------- Submit ---------- */
  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, date, people });
    setOpen(false);
  };

  const clearAll = () => { setQuery(""); setDate(""); setPeople(""); };

  /* ---------- Close on outside click ---------- */
  useEffect(() => {
    const click = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  return (
    <div className="relative w-full flex justify-center z-[9999]">  {/* <<< FIXED */}

      {/* ---------- Main Search Bar ---------- */}
      <form
        onSubmit={submit}
        className="w-[95%] max-w-[1050px] bg-white shadow-xl rounded-full
                   flex items-center gap-4 px-6 py-4 mt-10"
      >
        {/* Location */}
        <div className="flex flex-col flex-1 cursor-pointer" onClick={() => setOpen(true)}>
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <MapPin className="text-orange-500" size={18}/> LOCATION
          </label>
          <input className="outline-none text-[13px] mt-1 bg-transparent"
                 placeholder="Enter the Destination"
                 value={query} readOnly />
        </div>

        {/* Date */}
        <div className="flex flex-col flex-1 border-l pl-6">
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <Calendar className="text-orange-500" size={18}/> DATE
          </label>
          <input type="date" value={date}
                 className="outline-none text-[13px] mt-1 bg-transparent"
                 onChange={(e)=>setDate(e.target.value)} />
        </div>

        {/* Members */}
        <div className="flex flex-col flex-1 border-l pl-6">
          <label className="text-[12px] font-bold text-gray-700 flex gap-2 items-center">
            <Users className="text-orange-500" size={18}/> NO OF MEMBERS
          </label>
          <input placeholder="How many People?" type="number" min="1"
                 value={people}
                 className="outline-none text-[13px] mt-1 bg-transparent"
                 onChange={(e)=>setPeople(e.target.value)} />
        </div>

        <Mic size={20} onClick={voice} className="cursor-pointer text-orange-600" />

        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold
                           rounded-full px-7 py-2 text-[14px]">
          LET'S GO
        </button>
      </form>

      {/* ---------- Popup Modal (Now Works) ---------- */}
      {open && (
        <div ref={modalRef}
             className="absolute top-[120%] w-[90%] max-w-[900px] bg-white
                        rounded-2xl shadow-2xl p-6 max-h-[70vh] overflow-y-auto z-[99999]">

          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-5">
            <MapPin className="text-orange-600"/>
            <input autoFocus value={query}
                   placeholder="Search destination or stay type..."
                   className="flex-1 outline-none bg-transparent"
                   onChange={(e)=>setQuery(e.target.value)} />
            <Mic className="text-orange-600 cursor-pointer" size={18} onClick={voice}/>
            {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
          </div>

          {Object.entries(grouped).map(([state,data]) => (
            <div key={state} className="mb-6">
              <p className="font-bold text-[16px]">{state}</p>

              <p className="text-xs mt-2 text-gray-500">PLACES</p>
              <Row items={[...data.places]} pick={(v)=>{setQuery(v);setOpen(false)}}/>

              <p className="text-xs mt-3 text-gray-500">STAY TYPES</p>
              <Row items={[...data.types]} pick={(v)=>{setQuery(v);setOpen(false)}}/>
            </div>
          ))}

          <p className="font-bold mt-4">TRENDING LOCATIONS</p>
          <Row items={trendingLocations} pick={(v)=>{setQuery(v);setOpen(false)}}/>

          <p className="font-bold mt-4">TRENDING STAY TYPES</p>
          <Row items={trendingTypes} pick={(v)=>{setQuery(v);setOpen(false)}}/>
        </div>
      )}
    </div>
  );
}


/* Chips UI */
const Row = ({items,pick}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map(v => (
      <span key={v}
        onClick={()=>pick(v)}
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200
                   rounded-full text-xs cursor-pointer">
        {v}
      </span>
    ))}
  </div>
);
