// frontend/src/components/TripCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  const handleDetails = () => {
    if (trip.isHostListing) {
      navigate(`/host-listing/${trip._id}`);
    } else {
      navigate(`/packages/${trip._id}`);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hello,
I want to book:
${trip.title}
Location: ${trip.location}
Price: ₹${trip.price}`;
    window.open(
      `https://wa.me/918248579662?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const media = trip.images?.length ? trip.images : ["/no-image.jpg"];

  return (
    <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">

      {/* ===== IMAGE / VIDEO (BIGGER) ===== */}
      <div className="relative h-[320px]">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="h-full"
        >
          {media.map((src, i) => (
            <SwiperSlide key={i}>
              {src.endsWith(".mp4") ? (
                <video
                  src={src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={src}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* PRICE FLOAT (LIKE EXOTICAMP) */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold shadow">
          From ₹{trip.price} / person
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="p-6 flex flex-col flex-1 space-y-2">
        <h3 className="text-lg font-semibold leading-snug line-clamp-2">
          {trip.title}
        </h3>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          📍 {trip.location}
        </p>

        {/* CTA */}
        <div className="mt-auto flex gap-3 pt-4">
          <button
            onClick={handleDetails}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-full text-sm font-semibold transition"
          >
            View Details
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition"
          >
            <FaWhatsapp size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
