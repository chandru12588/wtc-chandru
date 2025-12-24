import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  /* =====================================================
     🔥 BUILD SEARCH SUGGESTIONS FROM ALL PACKAGES
  ===================================================== */
  const suggestions = useMemo(() => {
    const set = new Set();

    trips.forEach((t) => {
      if (t.location) set.add(t.location);
      if (t.region) set.add(t.region);
      if (t.category) set.add(t.category);
      if (t.title) set.add(t.title);
    });

    return Array.from(set);
  }, [trips]);

  const filtered = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions;

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
      setOpen(false);
    };
  };

  /* =====================================================
     SUBMIT SEARCH
  ===================================================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ location: query, people });
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
          w-full max-w-6xl mx-auto
          backdrop-blur-xl bg-white/70
          rounded-full shadow-2xl
          px-4 py-3
          flex flex-col md:flex-row items-center gap-4
        "
      >
        {/* SEARCH INPUT */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MapPin className="text-orange-500" />
          <div className="flex flex-col w-full">
            <span className="text-[11px] font-semibold">LOCATION / STAY TYPE</span>
            <input
              readOnly
              value={query}
              placeholder="Search destination, Tree House, Mud House..."
              className="bg-transparent outline-none text-sm cursor-pointer"
            />
          </div>
          <Mic
            onClick={(e) => {
              e.stopPropagation();
              startVoiceSearch();
            }}
            className="text-orange-600 cursor-pointer"
            size={18}
          />
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="text-orange-500" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 flex-1">
          <Users className="text-orange-500" />
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="bg-transparent outline-none text-sm"
            placeholder="People"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          {(query || people || date) && (
            <button
              type="button"
              onClick={clearAll}
              className="p-2 rounded-full bg-gray-200"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-3"
          >
            LET’S GO
          </button>
        </div>
      </form>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div className="absolute left-0 right-0 mt-4 z-50 flex justify-center">
          <div
            ref={panelRef}
            className="
              bg-white w-full max-w-3xl
              rounded-2xl shadow-2xl
              p-6
              fixed bottom-0 md:static
              max-h-[70vh] overflow-y-auto
            "
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type location or stay type..."
              className="w-full p-3 border rounded mb-4"
            />

            {filtered.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setQuery(item);
                  setOpen(false);
                }}
                className="py-3 px-2 cursor-pointer hover:bg-gray-100 rounded"
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
