import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic } from "lucide-react";

export default function AdvancedSearchBar({ onSearch }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const panelRef = useRef(null);

  /* ---------------- STATIC DATA ---------------- */
  const allLocations = [
    "Kashmir",
    "Jammu and Kashmir",
    "Tenkasi",
    "Tada",
    "Munnar",
    "Gavi",
    "Ooty",
    "Kodaikanal",
    "Manali",
    "Hampi",
  ];

  const trending = [
    "Gavi",
    "Munnar",
    "Varkala",
    "Meghalaya",
    "Vagamon",
    "Jawadhu Hills",
    "Tada",
    "Yelagiri",
    "Kotagiri",
    "Gokarna",
  ];

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

  /* ---------------- FILTER PANEL ---------------- */
  const handleModalInput = (txt) => {
    setModalInput(txt);

    if (!txt) {
      setFilteredSuggestions([]);
      return;
    }

    setFilteredSuggestions(
      allLocations.filter((l) =>
        l.toLowerCase().includes(txt.toLowerCase())
      )
    );
  };

  const selectLocation = (loc) => {
    setLocation(loc);
    setModalInput("");
    setShowPanel(false);
  };

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
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

  /* ---------------- SUBMIT (🔥 FINAL FIX) ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSearch) return;

    onSearch({
      location,
      date,
      people: Number(people),
    });

    // ✅ SCROLL TO RESULTS (IMPORTANT)
    setTimeout(() => {
      const el = document.getElementById("featured-trips");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="relative w-full">
      {/* SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-[1100px] mx-auto
          bg-white rounded-full shadow-xl
          px-4 py-4
          flex flex-col md:flex-row gap-4
        "
      >
        {/* LOCATION */}
        <div className="flex items-center gap-3 flex-1">
          <MapPin size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] font-semibold">LOCATION</p>
            <input
              value={location}
              placeholder="Enter Destination"
              className="text-sm w-full outline-none cursor-pointer"
              onFocus={() => setShowPanel(true)}
              readOnly
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

      {/* LOCATION PANEL */}
      {showPanel && (
        <div className="absolute left-0 right-0 mt-3 z-50 flex justify-center">
          <div
            ref={panelRef}
            className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6"
          >
            <input
              autoFocus
              value={modalInput}
              onChange={(e) => handleModalInput(e.target.value)}
              placeholder="Search places..."
              className="w-full p-3 border rounded mb-4"
            />

            {(filteredSuggestions.length
              ? filteredSuggestions
              : trending
            ).map((t, i) => (
              <div
                key={i}
                onClick={() => selectLocation(t)}
                className="py-3 cursor-pointer hover:bg-gray-100"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
