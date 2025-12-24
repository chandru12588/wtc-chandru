import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* 🟢 Group states → places dynamically */
  const grouped = useMemo(() => {
    const map = {};
    trips.forEach(t => {
      const state = t.region || "Others";
      if (!map[state]) map[state] = new Set();
      if (t.location) map[state].add(t.location);
      if (t.title) map[state].add(t.title);
    });
    return map;
  }, [trips]);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery("");
    setPeople("");
    setDate("");
    onSearch?.({ location: "", people: "" });
  };

  /* Voice Search */
  const voice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = e => setQuery(e.results[0][0].transcript);
  };

  useEffect(() => {
    const close = e => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full z-[200]">

      {/* 🔍 Main Search Bar */}
      <form onSubmit={handleSubmit}
        className="w-full max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-full shadow-md flex items-center gap-3 px-5 py-3">
        
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}>
          <MapPin className="text-orange-500" size={18}/>
          <input readOnly value={query} placeholder="Search Ooty, Poombarai, Tree House..."
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <Mic size={18} className="text-orange-600 cursor-pointer" onClick={voice}/>

        <div className="flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500"/>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"/>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Users size={18} className="text-orange-500"/>
          <input type="number" min="1" value={people} onChange={(e)=>setPeople(e.target.value)}
            placeholder="People" className="bg-transparent text-sm outline-none w-full"/>
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

      {/* 📌 Dropdown Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start p-5 z-[500]">
          <div ref={panelRef}
            className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search</h2>
              <X onClick={()=>setOpen(false)} size={20} className="cursor-pointer"/>
            </div>

            {/* Input inside modal */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4 gap-2">
              <MapPin className="text-orange-500"/>
              <input autoFocus value={query}
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="Type destination..."
                className="bg-transparent outline-none w-full"/>
              <Mic onClick={voice} className="text-orange-600 cursor-pointer"/>
              {query && <X size={16} className="cursor-pointer" onClick={()=>setQuery("")}/>}
            </div>

            {/* 🟩 Group Output State Wise */}
            {Object.keys(grouped).map(state=>(
              <div key={state} className="mb-5">
                <p className="font-bold text-[15px] mb-2 text-gray-700">{state}</p>
                <div className="flex flex-wrap gap-2">
                  {[...grouped[state]].map(item=>(
                    <span key={item} onClick={()=>{setQuery(item);setOpen(false);}}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs cursor-pointer">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
