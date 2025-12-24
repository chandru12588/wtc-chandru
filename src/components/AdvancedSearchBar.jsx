import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const panelRef = useRef(null);

  /* ================= DYNAMIC VALUES FROM DATABASE ================= */
  const suggestions = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => {
      if (t.location) set.add(t.location.trim());
      if (t.title) set.add(t.title.trim());
      if (t.category) set.add(t.category.trim());
    });
    return [...set];
  }, [trips]);

  /* auto trending from real trips */
  const trending = suggestions.slice(0, 10);

  const filtered = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : trending;

  /* ================= VOICE SEARCH ================= */
  const startVoice = (e) => {
    e.stopPropagation();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice recognition not supported");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => {
      setQuery(e.results[0][0].transcript);
      setOpen(true);
    };
  };

  /* ================= SUBMIT SEARCH ================= */
  const submit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  const clearAll = () => {
    setQuery(""); setPeople(""); setDate("");
  };

  /* close click outside */
  useEffect(() => {
    const fn = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="relative w-full">

      {/* TOP SEARCH BAR */}
      <form
        onSubmit={submit}
        className="max-w-6xl mx-auto flex items-center gap-3 
        bg-white/70 backdrop-blur-xl border border-gray-200
        rounded-full shadow-lg px-5 py-3 text-sm"
      >
        {/* Location input */}
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MapPin className="text-orange-500" size={18} />
          <input
            placeholder="Search destination / stay type"
            value={query}
            readOnly
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="text-orange-500" size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none bg-transparent w-full"
          />
        </div>

        {/* People */}
        <div className="flex items-center gap-2 flex-1">
          <Users className="text-orange-500" size={18} />
          <input
            type="number"
            min="1"
            placeholder="People"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="outline-none bg-transparent w-full"
          />
        </div>

        {/* Clear + Submit */}
        {query || people || date ? (
          <button onClick={clearAll} type="button" className="p-1.5 bg-gray-200 rounded-full">
            <X size={16} />
          </button>
        ) : null}

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2 font-semibold"
        >
          LET'S GO
        </button>
      </form>

      {/* ================= Modal Dropdown UI (Exotic Style) ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start md:items-center p-4 z-[999]">
          <div
            ref={panelRef}
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl 
            max-h-[80vh] overflow-y-auto p-6 md:p-8"
          >
            <div className="flex justify-between mb-3">
              <h2 className="font-bold text-lg">Location</h2>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
              <MapPin size={18} className="text-orange-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter destination"
                className="w-full bg-transparent outline-none ml-2"
              />
              <Mic size={18} className="text-orange-500 cursor-pointer" onClick={startVoice} />
            </div>

            {/* Trending Auto Generated */}
            <p className="font-semibold mb-2 text-sm">Trending</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {trending.map((item) => (
                <span
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs cursor-pointer"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Suggestions */}
            {filtered.map((item) => (
              <div
                key={item}
                onClick={() => { setQuery(item); setOpen(false); }}
                className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
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
