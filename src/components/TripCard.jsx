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
Price: ₹${trip.price}

Please guide me with booking.`;

    window.open(
      `https://wa.me/918248579662?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const media = trip.images?.length ? trip.images : ["/no-image.jpg"];

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition overflow-hidden flex flex-col">

      {/* ================= MEDIA SLIDER ================= */}
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

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* DURATION BADGE */}
        {trip.duration && (
          <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {trip.duration}
          </span>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-6 flex flex-col flex-1 gap-2">

        <h3 className="font-semibold text-lg leading-snug">
          {trip.title}
        </h3>

        <p className="text-sm text-gray-500">
          📍 {trip.location}
        </p>

        {/* DATE CHIPS (optional – Exotic style) */}
        {trip.availableDates?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {trip.availableDates.slice(0, 3).map((d, i) => (
              <span
                key={i}
                className="border border-orange-400 text-orange-500 text-xs px-3 py-1 rounded-full"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* PRICE */}
        <div className="mt-3 text-lg font-bold">
          From ₹{trip.price}
          <span className="text-sm font-normal text-gray-500">
            {" "} / person
          </span>
        </div>

        {/* CTA */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleDetails}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-full text-sm font-semibold transition"
          >
            View Details
          </button>

          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition"
          >
            <FaWhatsapp size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
