import React from "react";

const stayTypes = [
  "Tent / Camping Stay","A-Frame Stay","Mud House Stay","Glamping Stay",
  "TreeHouse","Glass House / Dome Stay","Cabin / Wooden Cottage",
  "Private Villa","Individual Bungalow","Farm Stay","Homestay","Resort Stay","Bamboo House"
];

export default function StayTypePopup({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn scale-100">

        <h2 className="text-xl font-bold text-center mb-5 text-gray-800">
          Choose Stay Type
        </h2>

        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {stayTypes.map((s,i)=>(
            <button
              key={i}
              onClick={()=>onSelect(s)}
              className="border py-3 rounded-xl text-sm font-semibold 
              hover:bg-orange-500 hover:text-white transition duration-200"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-200 hover:bg-gray-300 py-2 rounded-xl font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}
