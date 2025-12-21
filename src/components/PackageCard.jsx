// frontend/src/components/PackageCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PackageCard({ pkg }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={pkg.images?.[0]}
          onError={(e) => (e.target.src = "/no-image.png")}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold">{pkg.title}</h3>
        <p className="text-xs text-gray-500">{pkg.region}</p>

        <div className="mt-3 text-indigo-600 font-bold">₹ {pkg.price}</div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/booking/${pkg._id}`)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
          >
            Book
          </button>

          <a
            href={`https://wa.me/918248579662?text=I want to book ${pkg.title}`}
            target="_blank"
            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-center"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
