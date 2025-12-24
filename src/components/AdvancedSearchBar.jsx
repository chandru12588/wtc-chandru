import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic } from "lucide-react";

export default function AdvancedSearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);

  /* ---------------- VOICE SEARCH ---------------- */
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
      setLocation(e.results[0][0].transcript);
      setShowPanel(false);
    };
  };

  /* ---------------- SUBMIT (REAL FIX) ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSearch) return;

    onSearch({
      location: location.trim(),
      date,
      people: Number(people),
    });

    // auto scroll
    setTimeout(() => {
      const el = document.getElementById("featured-trips");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  /* ---------------- CLOSE PANEL ---------------- */
  useEffect(() => {
    if (!showPanel) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel]);

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1100px] mx-auto bg-white rounded-full shadow-xl px-4 py-4 flex flex-col md:flex-row gap-4"
      >
        {/* LOCATION */}
        <div className="flex items-center gap-3 flex-1">
          <MapPin size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">LOCATION</p>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter destination"
              className="text-sm w-full outline-none"
            />
          </div>
          <button type="button" onClick={startVoiceSearch}>
            <Mic size={16} className="text-orange-600" />
          </button>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">DATE</p>
            <input
              type="date"
              className="text-sm w-full outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 flex-1">
          <Users size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">NO OF MEMBERS</p>
            <input
              type="number"
              min="1"
              className="text-sm w-full outline-none"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-3"
        >
          LET’S GO
        </button>
      </form>
    </div>
  );
}
