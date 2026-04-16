import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaHeart, FaStar, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { api } from "../api.js";
import { getSafeImages } from "../utils/safeImage";
import { inferServiceType } from "../utils/serviceType";

import "swiper/css";
import "swiper/css/pagination";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918248579662";
const STAR_VALUES = [1, 2, 3, 4, 5];

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

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

  const handleDetails = () => {
    if (trip?.isActingDriverProfile) {
      handleWhatsApp();
      return;
    }

    if (serviceType === "host") {
      navigate(`/host-listing/${trip._id}`);
    } else if (serviceType === "bike") {
      navigate(`/pillion-request/${trip._id}`);
    } else {
      navigate(`/packages/${trip._id}`);
    }
  };

  const handleWhatsApp = () => {
    const rawNumber =
      trip?.driverProfile?.whatsappNumber ||
      trip?.driverProfile?.phone ||
      WHATSAPP_NUMBER;
    const targetNumber = String(rawNumber).replace(/[^\d]/g, "") || WHATSAPP_NUMBER;

    const msg = `Hello
I want to book:
${trip.title}
Location: ${trip.location}
Price: INR ${trip.price || "Contact"}`;

    window.open(
      `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const images = getSafeImages(trip.images);

  const handleFavorite = async (e) => {
    e.stopPropagation();

    try {
      const result = await toggleFavorite(trip);
      setIsFavorite(Boolean(result?.favorite));
    } catch {
      alert("Unable to update favorite right now");
    }
  };

  const handleRate = async (e, rating) => {
    e.stopPropagation();
    if (serviceType !== "general") return;

    if (!localStorage.getItem("wtc_token")) {
      alert("Please login first to add your rating");
      navigate("/login");
      return;
    }

    try {
      setSubmittingRating(true);
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("reviewText", "");

      await api.post(`/api/reviews/package/${trip._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserRating(rating);
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to save rating now");
    } finally {
      setSubmittingRating(false);
    }
  };

  const displayRating = userRating || Math.round(Number(trip.averageRating || trip.rating || 0));

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-md transition hover:shadow-xl"
      onClick={handleDetails}
    >
      <div className="relative h-[200px] overflow-hidden sm:h-[240px] lg:h-[300px]">
        <Swiper
          modules={[Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          pagination={{ clickable: true }}
          className="h-full trip-swiper cursor-pointer"
        >
          {images.length > 0 ? images.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={trip.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </SwiperSlide>
          )) : (
            <SwiperSlide>
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No image available</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                swiperRef.current?.slidePrev();
              }}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/70"
              aria-label="Previous image"
            >
              <FaChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                swiperRef.current?.slideNext();
              }}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white transition hover:bg-black/70"
              aria-label="Next image"
            >
              <FaChevronRight size={12} />
            </button>
          </>
        )}

        <button
          onClick={handleFavorite}
          className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl ring-1 ring-black/10 transition hover:scale-110"
        >
          <FaHeart className={isFavorite ? "text-red-500" : "text-gray-500"} />
        </button>

        {trip.instantBooking && (
          <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold shadow">
            Instant
          </span>
        )}

        {Number(trip.averageRating || trip.rating || 0) > 0 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-xs text-white">
            <FaStar className="text-yellow-400" />
            {(trip.averageRating || trip.rating || 0).toFixed(1)}
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-semibold shadow backdrop-blur">
          From INR {trip.price || "Contact"}
        </div>
      </div>

      <div className="space-y-2 p-4 md:p-5">
        <h3 className="line-clamp-2 text-base font-semibold">{trip.title}</h3>

        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 flex items-center gap-1 text-sm text-gray-500">
            <FaMapMarkerAlt className="shrink-0 text-orange-500" />
            {trip.location}
          </p>

          {serviceType === "general" && (
            <div className="flex items-center gap-0.5" title="Rate this package">
              {STAR_VALUES.map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={submittingRating}
                  onClick={(e) => handleRate(e, star)}
                  className="disabled:cursor-not-allowed"
                >
                  <FaStar size={13} className={star <= displayRating ? "text-amber-400" : "text-gray-300"} />
                </button>
              ))}
            </div>
          )}
        </div>

        {serviceType === "general" && trip.startDate && (
          <div className="mt-2 flex gap-2">
            <span className="rounded-full border border-orange-400 px-3 py-1 text-xs text-orange-600">
              {new Date(trip.startDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-2 md:gap-3 md:pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDetails();
            }}
            className="flex-1 rounded-full bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 md:py-2.5 md:text-sm"
          >
            {serviceType === "bike"
              ? "Book a ride"
              : serviceType === "guide"
              ? "Book a guide"
              : trip?.isActingDriverProfile
              ? "Contact Driver"
              : serviceType === "host"
              ? "View Stay"
              : "View Details"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsApp();
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-green-500 py-2 text-xs font-semibold text-white hover:bg-green-600 md:gap-2 md:py-2.5 md:text-sm"
          >
            <FaWhatsapp size={18} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
