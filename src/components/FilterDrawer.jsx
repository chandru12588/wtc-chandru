import React, { useEffect } from "react";

export default function FilterDrawer({ isOpen, onClose, onApply }) {
  useEffect(() => {
    // Disable background scroll when drawer is open
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] transition-all duration-300 
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl 
        transition-all duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

        <h2 className="text-lg font-semibold mb-4">Filter Trips</h2>

        {/* Category Filters */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Category</h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex gap-2 items-center">
              <input type="checkbox" value="camping" /> Camping
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" value="forest" /> Forest
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" value="mountain" /> Mountain
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" value="family" /> Family
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="w-1/2 mr-2 py-2 rounded-full border text-gray-700 font-medium"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="w-1/2 ml-2 py-2 rounded-full bg-emerald-600 text-white font-semibold"
            onClick={onApply}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
