import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Calendar, Users, Mic, X } from "lucide-react";

export default function AdvancedSearchBar({ trips = [], onSearch }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);

  /* ================= BUILD SUGGESTIONS ================= */
  const suggestions = useMemo(() => {
    const set = new Set();
    trips.forEach((t) => {
      if (t.title) set.add(t.title);
      if (t.location) set.add(t.location);
      if (t.region) set.add(t.region);
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [trips]);

  const filtered = query
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : suggestions.slice(0, 20);

  /* ================= HANDLERS ================= */
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

  /* OUTSIDE CLICK CLOSE */
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
    <div className="relative w-full z-[100]">

      {/* 🔥 MAIN GLASS SEARCH BAR */}
      <form
        onSubmit={handleSubmit}
        className="
        bg-white/70 backdrop-blur-xl border border-white/20
        w-full max-w-6xl mx-auto rounded-full shadow-lg
        px-5 py-3 flex items-center gap-3
        "
      >
        {/* Location */}
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <MapPin className="text-orange-500" size={18} />
          <input
            placeholder="Enter the Destination"
            value={query}
            readOnly
            className="bg-transparent text-sm w-full outline-none"
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
            placeholder="People"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        {/* Actions */}
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 rounded-full px-6 py-2 text-white text-xs font-bold"
        >
          LET’S GO
        </button>
      </form>

      {/* ================= MODAL LIKE YOUR PIC ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start md:items-center z-[200] p-3 md:p-0">
          <div
            ref={panelRef}
            className="
              bg-white rounded-3xl shadow-xl
              w-full max-w-4xl max-h-[75vh] overflow-y-auto
              p-5 md:p-8
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Location</h2>
              <X
                onClick={() => setOpen(false)}
                className="cursor-pointer text-gray-500"
              />
            </div>

            {/* Input inside modal */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-5">
              <MapPin size={18} className="text-orange-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter the Destination"
                className="bg-transparent w-full outline-none ml-2"
              />
              <Mic className="text-orange-500 cursor-pointer" size={18} />
            </div>

            {/* Trending Searches */}
            <p className="font-semibold text-sm mb-2">Trending Searches</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Gavi","Munnar","Varkala","Meghalaya","Vagamon","Jawadhu Hills","Tada"].map((tag) => (
                <span
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Trending Locations */}
            <p className="font-semibold text-sm mb-2">Trending Locations</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Ooty","Kodaikanal","Masinagudi","Yelagiri","Gokarna","Kotagiri","Dandeli"].map((loc) => (
                <span
                  key={loc}
                  onClick={() => setQuery(loc)}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs cursor-pointer"
                >
                  {loc}
                </span>
              ))}
            </div>

            {/* Live search suggestions */}
            <div className="border-t pt-3">
              {filtered.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    setOpen(false);
                  }}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
