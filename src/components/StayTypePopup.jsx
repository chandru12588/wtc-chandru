import React from "react";

// Stay types MUST match exact values stored in DB package form
const stayTypes = [
  "Tent / Camping Stay",
  "A-Frame Stay",
  "Mud House Stay",
  "Glamping Stay",
  "Tree House",
  "Glass House / Dome Stay",
  "Cabin / Wooden Cottage",
  "Private Villa",
  "Individual Bungalow", // OR "Bungalow" if that's saved in DB
  "Farm Stay",
  "Homestay",
  "Resort Stay"
];

export default function StayTypePopup({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl animate-fadeIn">
        
        <h3 className="text-xl font-bold mb-5 text-center text-gray-800">
          Choose Stay Type
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {stayTypes.map((s,i)=>(
            <button 
              key={i} 
              onClick={()=>onSelect(s)}
              className="p-3 border rounded-lg font-medium hover:bg-orange-100 hover:border-orange-400 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-5 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
