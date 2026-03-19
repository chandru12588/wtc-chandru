import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { inferServiceType } from "../utils/serviceType";

import "swiper/css";
import "swiper/css/pagination";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "918248579662";

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const serviceType = inferServiceType(trip);

  /* =========================
     SAFE NAVIGATION (FIX 🔥)
  ========================= */
  const handleDetails = () => {
    if (!trip?._id) {
      console.error("❌ Invalid trip data:", trip);
      return;
    }

    // 🔥 FORCE CORRECT ROUTING
    if (trip.isHostListing) {
      navigate(`/host-listing/${trip._id}`);
    } else if (serviceType === "bike") {
      navigate(`/pillion-request/${trip._id}`);
    } else if (serviceType === "guide") {
      navigate(`/guide/${trip._id}`);
    } else {
      // ✅ ONLY PACKAGES COME HERE
      navigate(`/packages/${trip._id}`);
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hello 👋
I want to book:
${trip.title}
📍 ${trip.location}
💰 ₹${trip.price || "Contact"}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const images = trip.images?.length ? trip.images : ["/no-image.jpg"];

  return (
    <div
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden group cursor-pointer"
      onClick={handleDetails}
    >
      {/* IMAGE */}
      <div className="relative h-[300px] overflow-hidden">
        <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white p-2 rounded-full"
        >
          <FaHeart />
        </button>

        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm">
          ₹{trip.price || "Contact"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold">{trip.title}</h3>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarkerAlt /> {trip.location}
        </p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDetails();
            }}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-full"
          >
            View
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsApp();
            }}
            className="flex-1 bg-green-500 text-white py-2 rounded-full flex items-center justify-center gap-1"
          >
            <FaWhatsapp />
          </button>
        </div>
      </div>
    </div>
  );
}