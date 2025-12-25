import React from "react";

export default function CitySelectPopup({ stayType, trips, onSelect, onClose }) {

  const normalize = (str) => str?.toLowerCase().replace(/\s|\/|-/g, "");
  const filtered = trips.filter(p => normalize(p.stayType) === normalize(stayType));
  const cities = [...new Set(filtered.map(p => p.location))];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 
      animate-popup relative mt-6">

        {/* Title */}
        <h3 className="text-[20px] font-bold text-center mb-5 text-gray-800">
          Select City for <span className="text-orange-600 font-bold">{stayType}</span>
        </h3>

        {/* City buttons */}
        <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto scroll-smooth pr-1">
          {cities.length > 0 ? (
            cities.map((c,i)=>(
              <button key={i} 
                onClick={()=>onSelect(c)}
                className="p-3 border rounded-xl font-medium hover:bg-orange-500 
                hover:text-white transition active:scale-95"
              >
                {c}
              </button>
            ))
          ) : (
            <p className="col-span-2 text-center text-red-600 py-2 font-semibold">
              ❌ No stay found for this type
            </p>
          )}
        </div>

        {/* Back button */}
        <button 
          onClick={onClose}
          className="w-full mt-5 py-2 bg-gray-200 rounded-xl 
          hover:bg-gray-300 transition font-semibold"
        >
          Back
        </button>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes popup {
          from { opacity:0; transform:scale(.92); }
          to   { opacity:1; transform:scale(1); }
        }
        .animate-popup { animation: popup .25s ease; }
      `}</style>
    </div>
  );
}
