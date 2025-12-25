import React, { useMemo } from "react";

export default function CitySelectPopup({ stayType, trips, onSelect, onClose }) {

  // Normalize values to avoid mismatch like "Tent Stay" vs "Tent / Camping Stay"
  const normalize = (str) => str?.toLowerCase().replace(/\s|\/|-/g, "");

  const selectedKey = normalize(stayType);

  const filtered = trips.filter(p => normalize(p.stayType) === selectedKey);

  const cities = [...new Set(filtered.map(p => p.location))];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl">
        
        <h3 className="text-lg font-bold mb-4 text-center text-gray-800">
          Select City for <span className="text-orange-600">{stayType}</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {cities.length > 0 ? (
            cities.map((c,i)=>(
              <button 
                key={i} 
                onClick={()=>onSelect(c)}
                className="p-3 border rounded-lg hover:bg-orange-100 hover:border-orange-400 font-semibold transition"
              >
                {c}
              </button>
            ))
          ) : (
            <p className="col-span-2 text-center text-red-600 font-bold py-2">
              ❌ No stay found for this type
            </p>
          )}
        </div>

        <button 
          onClick={onClose}
          className="mt-5 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
        >
          Back
        </button>
      </div>

    </div>
  );
}
