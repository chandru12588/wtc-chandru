import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* BUILD SEARCH WORDS FROM DB PACKAGES ONLY */
  const suggestions = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => {
      t.title && set.add(t.title);
      t.location && set.add(t.location);
      t.region && set.add(t.region);
      t.category && set.add(t.category);
    });
    return [...set];
  }, [trips]);

  const filtered = query
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions; // show all if empty

  /* ---------------- Voice Search ---------------- */
  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice search not supported in this browser");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.start();
    rec.onresult = (e) => {
      setQuery(e.results[0][0].transcript);
      setOpen(true);
    };
  };

  /* Search Submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
    setOpen(false);
  };

  /* Clear All */
  const clearAll = () => {
    setQuery("");
    setPeople("");
    setDate("");
    onSearch?.({ location: "", people: "" });
  };

  /* Close dropdown when clicking outside */
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
    <div className="relative w-full z-[200]">

      {/* ================= TOP GLASS SEARCH BAR ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-md w-full max-w-6xl mx-auto 
        rounded-full shadow-lg px-5 py-3 flex items-center gap-4 border border-white/30"
      >
        {/* Location */}
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MapPin className="text-orange-500" size={18} />
          <input
            value={query}
            readOnly
            placeholder="Search Ooty, Treehouse, Dome Stay..."
            className="bg-transparent w-full outline-none text-sm"
          />

          {/* Voice Search outside */}
          <Mic
            size={18}
            className="text-orange-600 cursor-pointer hover:scale-110"
            onClick={(e) => { e.stopPropagation(); startVoice(); }}
          />

          {/* Clear button outside */}
          {query && (
            <X
              size={16}
              className="text-gray-600 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
            />
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
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
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full 
          px-6 py-2 text-xs font-bold">
          LET'S GO
        </button>
      </form>

      {/* ================= DROPDOWN MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/35 flex justify-center items-start md:items-center p-4 z-[999]">
          <div
            ref={panelRef}
            className="bg-white w-full max-w-4xl max-h-[75vh] overflow-y-auto 
            rounded-3xl shadow-2xl p-6 relative"
          >
            {/* Close button */}
            <X
              size={20}
              className="absolute top-5 right-5 cursor-pointer"
              onClick={() => setOpen(false)}
            />

            <h2 className="font-semibold text-lg mb-4">Search</h2>

            {/* Input with Voice + Clear (INSIDE) */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4 gap-2">
              <MapPin size={18} className="text-orange-500" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type destination..."
                className="bg-transparent flex-1 outline-none"
              />

              {/* Voice inside */}
              <Mic
                size={18}
                className="text-orange-600 cursor-pointer"
                onClick={startVoice}
              />

              {/* Clear inside */}
              {query && (
                <X
                  className="cursor-pointer text-gray-600 hover:text-red-500"
                  onClick={() => setQuery("")}
                />
              )}
            </div>

            {/* Suggestions list */}
            <div>
              {filtered.length > 0 ? (
                filtered.map((v) => (
                  <div
                    key={v}
                    className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => { setQuery(v); setOpen(false); }}
                  >
                    {v}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
