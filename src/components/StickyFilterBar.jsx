import React from "react";
import { FiFilter } from "react-icons/fi";
import { FaListUl } from "react-icons/fa";

export default function StickyFilterBar({ onOpenFilter }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-white shadow-lg border-t py-3 px-6 flex justify-between items-center">
      
      <button className="flex items-center gap-2 font-medium text-gray-700">
        <FaListUl size={18} />
        Categories
      </button>

      <button 
        className="flex items-center gap-2 font-medium text-gray-700"
        onClick={onOpenFilter}
      >
        <FiFilter size={20} />
        Filter
      </button>

    </div>
  );
}
