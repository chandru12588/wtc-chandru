// frontend/src/components/TripCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  const handleDetails = () => {
    if (trip.isHostListing) {
      navigate(`/host-listing/${trip._id}`); // ✅ correct route
    } else {
      navigate(`/packages/${trip._id}`); // admin package
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hello,
I want to book:
${trip.title}
Location: ${trip.location}
Price: ₹${trip.price}

Please guide me with booking.`;

    window.open(
      `https://wa.me/918248579662?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col">
      <img
        src={trip.images?.[0] || "/no-image.jpg"}
        alt={trip.title}
        className="h-44 w-full object-cover"
      />

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg">{trip.title}</h3>
        <p className="text-sm text-gray-600">{trip.location}</p>

        <p className="text-lg font-extrabold mt-2">₹ {trip.price}</p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            onClick={handleDetails}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full text-sm font-semibold"
          >
            View Details
          </button>

          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <FaWhatsapp size={18} /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
