// frontend/src/components/AdvancedSearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic } from "lucide-react";

export default function AdvancedSearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [modalInput, setModalInput] = useState("");

  const panelRef = useRef(null);

  const locations = [
    "Ooty",
    "Kodaikanal",
    "Munnar",
    "Gavi",
    "Tada",
    "Valparai",
    "Yelagiri",
    "Varkala",
    "Gokarna",
    "Meghalaya",
  ];

  /* ---------------- VOICE ---------------- */
  const startVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");

    const r = new SR();
    r.lang = "en-IN";
    r.start();

    r.onresult = (e) => {
      setLocation(e.results[0][0].transcript);
      setShowPanel(false);
    };
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSearch) return;

    onSearch({
      location,
      people: Number(people),
    });

    setTimeout(() => {
      document
        .getElementById("featured-trips")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  /* ---------------- CLOSE PANEL ---------------- */
  useEffect(() => {
    if (!showPanel) return;

    const h = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };

    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showPanel]);

  return (
    <div className="relative w-full">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-full shadow-xl px-4 py-4 flex flex-col md:flex-row gap-4"
      >
        {/* LOCATION */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => setShowPanel(true)} // ✅ GUARANTEED OPEN
        >
          <MapPin className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">LOCATION</p>
            <input
              value={location}
              placeholder="Where are you going?"
              className="text-sm w-full outline-none pointer-events-none bg-transparent"
            />
          </div>
          <button type="button" onClick={startVoiceSearch}>
            <Mic className="text-orange-600" size={16} />
          </button>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">DATE</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm w-full outline-none"
            />
          </div>
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 flex-1">
          <Users className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">MEMBERS</p>
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="text-sm w-full outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3"
        >
          LET’S GO
        </button>
      </form>

      {/* LOCATION PANEL */}
      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end md:items-center justify-center">
          <div
            ref={panelRef}
            className="bg-white w-full md:max-w-3xl rounded-t-2xl md:rounded-2xl p-6"
          >
            <input
              autoFocus
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder="Search destinations..."
              className="w-full p-3 border rounded mb-4"
            />

            {(modalInput
              ? locations.filter((l) =>
                  l.toLowerCase().includes(modalInput.toLowerCase())
                )
              : locations
            ).map((l, i) => (
              <div
                key={i}
                onClick={() => {
                  setLocation(l);
                  setModalInput("");
                  setShowPanel(false);
                }}
                className="py-3 cursor-pointer hover:bg-gray-100"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
