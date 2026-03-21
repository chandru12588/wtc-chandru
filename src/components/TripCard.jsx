import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { inferServiceType } from "../utils/serviceType";
import { loadFavorites, toggleFavorite } from "../utils/wishlist";

import "swiper/css";
import "swiper/css/pagination";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "918248579662";

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  /* =========================
     DETECT SERVICE TYPE
  ========================= */
  const serviceType = inferServiceType(trip);

  useEffect(() => {
    let mounted = true;

    const syncFavorite = async () => {
      try {
        const list = await loadFavorites();
        if (!mounted) return;
        setIsFavorite(list.some((fav) => String(fav.itemId) === String(trip?._id)));
      } catch {
        if (!mounted) return;
        setIsFavorite(false);
      }
    };

    syncFavorite();
    return () => {
      mounted = false;
    };
  }, [trip?._id]);

  /* =========================
     HANDLE NAVIGATION (FIXED 🔥)
  ========================= */
  const handleDetails = () => {
    if (serviceType === "host") {
      navigate(`/host-listing/${trip._id}`);
    } else if (serviceType === "bike") {
      navigate(`/pillion-request/${trip._id}`);
    } else if (serviceType === "guide") {
      navigate(`/packages/${trip._id}`);
    } else {
      navigate(`/packages/${trip._id}`);
    }
  };

  /* =========================
     WHATSAPP
  ========================= */
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

  const handleFavorite = async (e) => {
    e.stopPropagation();

    try {
      const result = await toggleFavorite(trip);
      setIsFavorite(Boolean(result?.favorite));
    } catch {
      alert("Unable to update favorite right now");
    }
  };

  return (
    <div
      className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden group cursor-pointer"
      onClick={handleDetails}
    >
      {/* ================= IMAGE SLIDER ================= */}
      <div className="relative h-[300px] overflow-hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="h-full trip-swiper cursor-pointer"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={trip.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ❤️ Wishlist */}
        <button
          onClick={handleFavorite}
          className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl ring-1 ring-black/10 transition hover:scale-110"
        >
          <FaHeart className={isFavorite ? "text-red-500" : "text-gray-500"} />
        </button>

        {/* ⚡ Instant */}
        {trip.instantBooking && (
          <span className="absolute top-4 left-4 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow">
            ⚡ Instant
          </span>
        )}

        {/* ⭐ Rating */}
        {trip.rating && (
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {trip.rating}
          </div>
        )}

        {/* 💰 Price */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold shadow">
          From ₹{trip.price || "Contact"}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-5 space-y-2">
        <h3 className="text-base font-semibold line-clamp-2">
          {trip.title}
        </h3>

        {/* 📍 Location */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarkerAlt className="text-orange-500" />
          {trip.location}
        </p>

        {/* 🏷️ DATE */}
        {serviceType === "general" && trip.startDate && (
          <div className="flex gap-2 mt-2">
            <span className="border border-orange-400 text-orange-600 text-xs px-3 py-1 rounded-full">
              {new Date(trip.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        )}

        {/* ================= CTA ================= */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDetails();
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-full text-sm font-semibold"
          >
            {serviceType === "bike"
              ? "Book a ride"
              : serviceType === "guide"
              ? "Book a guide"
              : serviceType === "host"
              ? "View Stay"
              : "View Details"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsApp();
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-full flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <FaWhatsapp size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
