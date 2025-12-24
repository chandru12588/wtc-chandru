import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  /* =====================================================
     🔥 BUILD SUGGESTIONS FROM ADMIN + HOST PACKAGES
  ===================================================== */
  const suggestions = useMemo(() => {
    const set = new Set();

    trips.forEach((t) => {
      if (t.title) set.add(t.title);
      if (t.location) set.add(t.location);
      if (t.region) set.add(t.region);
      if (t.category) set.add(t.category);       // Tree House, Tent, Dome, etc
      if (t.stayType) set.add(t.stayType);       // optional future field
    });

    return Array.from(set);
  }, [trips]);

  const filtered = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions.slice(0, 15);

  /* =====================================================
     🎤 VOICE SEARCH
  ===================================================== */
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (e) => {
      setQuery(e.results[0][0].transcript);
      setOpen(true);
    };
  };

  /* =====================================================
     SUBMIT SEARCH
  ===================================================== */
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

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full">
      {/* ================= SEARCH BAR ================= */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-5xl mx-auto
          backdrop-blur-xl bg-white/70
          rounded-full shadow-xl
          px-4 py-3
          flex flex-col md:flex-row items-center gap-4
        "
      >
        {/* LOCATION */}
        <div className="flex items-center gap-3 flex-1">
          <MapPin className="text-orange-500" size={18} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Location or stay type (Tree House, Dome, Mud House...)"
            className="bg-transparent outline-none text-sm w-full"
          />
          <Mic
            onClick={startVoiceSearch}
            className="text-orange-600 cursor-pointer"
            size={16}
          />
        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 flex-1">
          <Calendar size={18} className="text-orange-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* PEOPLE */}
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

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {(query || people || date) && (
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
            className="bg-orange-500 hover:bg-orange-600
              text-white font-semibold rounded-full
              px-6 py-2 text-sm"
          >
            LET’S GO
          </button>
        </div>
      </form>

      {/* ================= DROPDOWN ================= */}
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 mt-3 z-50 flex justify-center">
          <div
            ref={panelRef}
            className="
              bg-white w-full max-w-4xl
              rounded-2xl shadow-2xl
              p-4
              max-h-[60vh] overflow-y-auto
            "
          >
            {filtered.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setQuery(item);
                  setOpen(false);
                }}
                className="py-3 px-3 cursor-pointer
                  hover:bg-gray-100 rounded-md text-sm"
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
