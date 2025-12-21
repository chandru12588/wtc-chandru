import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdvancedSearchBar() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const [showPanel, setShowPanel] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const panelRef = useRef(null);
  const navigate = useNavigate();

  /* ================= GEOLOCATION ================= */
  const askUserLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        // Later: reverse geocode → city
      },
      () => {
        console.log("Location permission denied");
      }
    );
  };

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

  const trendingSearches = [
    "Gavi",
    "Munnar",
    "Varkala",
    "Meghalaya",
    "Vagamon",
    "Jawadhu Hills",
    "Tada",
  ];

  const trendingLocations = [
    "Havelock Island",
    "Yelagiri",
    "Nelliyampathy",
    "Gavi",
    "Masinagudi",
    "Kotagiri",
    "Gokarna",
    "Varkala",
    "Dandeli",
    "Tada",
  ];

  /* ---------------- VOICE SEARCH ---------------- */
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      setLocation(event.results[0][0].transcript);
    };
  };

  /* ---------------- FILTER ---------------- */
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

  /* ---------------- SELECT LOCATION ---------------- */
  const selectLocation = (loc) => {
    setLocation(loc);
    setModalInput("");
    setShowPanel(false);
  };

  /* ---------------- OUTSIDE CLICK CLOSE ---------------- */
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

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/search?location=${encodeURIComponent(
        location
      )}&date=${date}&people=${people}`
    );
  };

  return (
    <div className="relative w-full">
      {/* ================= SEARCH BAR ================= */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-[1100px] mx-auto
          md:bg-white md:rounded-full md:shadow-xl md:px-6 md:py-4
          bg-white/20 backdrop-blur-lg rounded-xl
          px-4 py-4
          flex flex-col md:flex-row gap-4
        "
      >
        {/* LOCATION */}
        <div className="flex items-center gap-3 flex-1">
          <MapPin size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] md:text-xs font-semibold text-gray-700">
              LOCATION
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={location}
                placeholder="Enter Destination"
                className="text-sm w-full outline-none h-8 cursor-pointer"
                onClick={() => {
                  askUserLocation();   // 🔥 LOCATION POPUP
                  setShowPanel(true); // 🔥 OPEN PANEL
                }}
              />
              <button
                type="button"
                onClick={startVoiceSearch}
                className="p-2 bg-white/40 hover:bg-white rounded-full"
              >
                <Mic size={16} className="text-orange-600" />
              </button>
            </div>
          </div>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-3 flex-1">
          <Calendar size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] md:text-xs font-semibold text-gray-700">
              DATE
            </p>
            <input
              type="date"
              className="text-sm w-full outline-none h-8"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* PEOPLE */}
        <div className="flex items-center gap-3 flex-1">
          <Users size={20} className="text-orange-500" />
          <div className="flex flex-col w-full">
            <p className="text-[11px] md:text-xs font-semibold text-gray-700">
              NO OF MEMBERS
            </p>
            <input
              type="number"
              min="1"
              className="text-sm w-full outline-none h-8"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-3 w-full md:w-auto"
        >
          LET’S GO
        </button>
      </form>

      {/* ================= LOCATION PANEL ================= */}
      {showPanel && (
        <div className="absolute left-0 right-0 mt-3 z-50 flex justify-center">
          <div
            ref={panelRef}
            className="
              bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6
              fixed bottom-0 left-0 right-0 md:static
              md:rounded-2xl rounded-t-2xl
              max-h-[80vh] overflow-y-auto
            "
          >
            <h2 className="text-xl font-bold mb-4">Location</h2>

            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-full mb-4">
              <MapPin className="text-orange-500" size={20} />
              <input
                autoFocus
                type="text"
                value={modalInput}
                onChange={(e) => handleModalInput(e.target.value)}
                placeholder="Search places..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {filteredSuggestions.map((l, i) => (
              <div
                key={i}
                onClick={() => selectLocation(l)}
                className="py-3 border-b cursor-pointer hover:bg-gray-50"
              >
                {l}
              </div>
            ))}

            <h3 className="font-semibold mt-6 mb-2">Trending Searches</h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((t, i) => (
                <span
                  key={i}
                  onClick={() => selectLocation(t)}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="font-semibold mt-6 mb-2">Trending Locations</h3>
            <div className="flex flex-wrap gap-2">
              {trendingLocations.map((t, i) => (
                <span
                  key={i}
                  onClick={() => selectLocation(t)}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
