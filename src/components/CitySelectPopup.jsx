import React from "react";

export default function CitySelectPopup({ stayType, trips, onSelect, onClose }) {

  const cities = [...new Set(
    trips.filter(p=>p.stayType?.toLowerCase()===stayType.toLowerCase()).map(p=>p.location)
  )];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h3 className="text-xl font-bold mb-3 text-center">Select City for {stayType}</h3>

        <div className="grid grid-cols-2 gap-3">
          {cities.length>0 ? cities.map((c,i)=>(
            <button key={i} onClick={()=>onSelect(c)}
              className="p-3 border rounded-lg hover:bg-orange-200 font-semibold">
              {c}
            </button>
          )) : <p className="text-center text-red-600 font-bold">No city found</p>}
        </div>

        <button onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded-md">Back</button>
      </div>
    </div>
  );
}
