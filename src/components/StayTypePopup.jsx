import React from "react";

const stayTypes = [
  "Tent Stay","A-Frame Stay","Mud House","Glamping Stay",
  "Tree House","Dome Stay","Cabin / Cottage","Private Villa",
  "Bungalow","Farm Stay","Homestay","Resort Stay"
];

export default function StayTypePopup({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
        <h3 className="text-xl font-bold mb-3 text-center">Choose Stay Type</h3>
        <div className="grid grid-cols-2 gap-3">
          {stayTypes.map((s,i)=>(
            <button key={i} onClick={()=>onSelect(s)}
              className="p-3 border rounded-lg hover:bg-orange-200 font-semibold">
              {s}
            </button>
          ))}
        </div>
        <button onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded-md">Close</button>
      </div>
    </div>
  );
}
