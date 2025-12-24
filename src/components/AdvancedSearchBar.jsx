import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);
  const inputRef = useRef(null);

  /* 🟢 Build suggestions dynamically from admin+host packages */
  const suggestions = useMemo(() => {
    const set = new Set();

    trips.forEach((t) => {
      t.title && set.add(t.title);
      t.location && set.add(t.location);
      t.region && set.add(t.region);
      t.category && set.add(t.category); // stay type
    });

    return Array.from(set);
  }, [trips]);

  const filtered = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions.slice(0, 15); // show limited list

  /* 🎤 Voice Search */
  const startVoiceSearch = (e) => {
    e.stopPropagation();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice search not supported");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => {
      setQuery(e.results[0][0].transcript);
      setOpen(true);
    };
  };

  /* Search submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery("");
    setDate("");
    setPeople("");
    onSearch?.({ location: "", people: "" });
  };

  /* Close dropdown on outside click */
  useEffect(() => {
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative w-full z-[9999]">

      {/* 🔥 Top Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-6xl mx-auto
          bg-white/60 backdrop-blur-md
          rounded-full shadow-xl border border-white/30
          px-5 py-3 flex flex-col md:flex-row gap-3 items-center
        "
      >
        {/* Location Input */}
        <div className="flex items-center gap-2 flex-1">
          <MapPin className="text-orange-500" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search: Ooty, Dome Stay, Treehouse..."
            className="bg-transparent text-sm outline-none w-full"
          />
          <Mic
            size={18}
            className="text-orange-600 cursor-pointer hover:scale-110"
            onClick={startVoiceSearch}
          />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        {/* People */}
        <div className="flex items-center gap-2 flex-1">
          <Users size={18} className="text-orange-500" />
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="People"
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {(query || date || people) && (
            <button
              type="button"
              onClick={clearAll}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full 
              px-6 py-2 font-semibold text-sm"
          >
            LET'S GO
          </button>
        </div>
      </form>

      {/* ================= DROPDOWN (LIKE YOUR PIC) ================= */}
      {open && (
        <div className="absolute left-0 right-0 mt-3 flex justify-center z-[9998]">
          <div
            ref={panelRef}
            className="
              bg-white shadow-2xl rounded-2xl p-4
              w-full max-w-4xl max-h-[50vh] overflow-y-auto
              border border-gray-100
            "
          >
            {filtered.map((item) => (
              <div
                key={item}
                onClick={() => { setQuery(item); setOpen(false); }}
                className="py-2 px-3 text-[14px] cursor-pointer hover:bg-gray-100 rounded"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
