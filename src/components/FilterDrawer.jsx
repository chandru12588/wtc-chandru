// frontend/src/components/FilterDrawer.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function FilterDrawer({ isOpen, onClose, onApply, allTrips }) {

  const [state, setState] = useState("");
  const [stayType, setStayType] = useState("");
  const [theme, setTheme] = useState("");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [instant, setInstant] = useState(false);

  // 🔥 Extract stay types from backend automatically
  const stayTypes = [...new Set(allTrips?.map(item => item.stayType).filter(Boolean))];
  const themes = [...new Set(allTrips?.map(item => item.category).filter(Boolean))];
  const activities = [...new Set(allTrips?.flatMap(item => item.tags || []).filter(Boolean))];
  const locations = [...new Set(allTrips?.map(item => item.location).filter(Boolean))];

  /* Disable body scroll when drawer opens */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleApply = () => {
    onApply({ state, stayType, theme, activity, date, instant });
  };

  const handleClear = () => {
    setState(""); setStayType(""); setTheme(""); setActivity(""); setDate(""); setInstant(false);
    onApply({});
  };


  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={onClose} />
      )}

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-xl 
      overflow-y-auto transition-transform duration-300 z-[9999] 
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="p-6 space-y-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold">Filters</h2>
            <button onClick={onClose}><X size={26} /></button>
          </div>

          {/* Select Location */}
          <select className="border p-3 rounded w-full" value={state} onChange={e => setState(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map((loc,i)=><option key={i}>{loc}</option>)}
          </select>

          {/* Stay Type */}
          <select className="border p-3 rounded w-full" value={stayType} onChange={e => setStayType(e.target.value)}>
            <option value="">Select Stay Type</option>
            {stayTypes.map((s,i)=><option key={i}>{s}</option>)}
          </select>

          {/* Theme */}
          <select className="border p-3 rounded w-full" value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="">Select Theme</option>
            {themes.map((t,i)=><option key={i}>{t}</option>)}
          </select>

          {/* Activities */}
          <select className="border p-3 rounded w-full" value={activity} onChange={e => setActivity(e.target.value)}>
            <option value="">Select Activity</option>
            {activities.map((a,i)=><option key={i}>{a}</option>)}
          </select>

          {/* Date */}
          <div>
            <input type="date" className="border p-3 rounded w-full"
              value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {/* Instant Booking */}
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={instant} onChange={e => setInstant(e.target.checked)} />
            <span>Instant Booking</span>
          </label>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4">
            <button className="text-orange-600 font-semibold" onClick={handleClear}>CLEAR NOW</button>
            <button className="px-6 py-2 bg-orange-600 text-white rounded font-bold" onClick={handleApply}>
              APPLY
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
