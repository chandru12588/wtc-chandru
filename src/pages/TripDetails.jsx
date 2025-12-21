// frontend/src/pages/TripDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  const [showSlider, setShowSlider] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };

    loadTrip();
  }, [id]);

  if (!trip)
    return <div className="p-10 text-center text-gray-600">Loading…</div>;

  const images = trip.images?.length ? trip.images : [trip.image];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* TITLE */}
      <h1 className="text-3xl font-bold">{trip.title}</h1>
      <p className="text-gray-600 mt-1">{trip.region || "Beautiful Destination"}</p>

      {/* IMAGE GALLERY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
        {/* MAIN IMAGE */}
        <div className="md:col-span-2 row-span-2">
          <img
            src={images[0]}
            className="w-full h-[420px] object-cover rounded-xl cursor-pointer"
            onClick={() => {
              setSlideIndex(0);
              setShowSlider(true);
            }}
          />
        </div>

        {/* SMALL IMAGES */}
        {images.slice(1, 5).map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-[200px] object-cover rounded-xl cursor-pointer"
            onClick={() => {
              setSlideIndex(i + 1);
              setShowSlider(true);
            }}
          />
        ))}
      </div>

      {images.length > 5 && (
        <button
          onClick={() => setShowSlider(true)}
          className="mt-3 underline text-gray-700"
        >
          View all photos ({images.length})
        </button>
      )}

      {/* FULLSCREEN SLIDER */}
      {showSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setShowSlider(false)}
          >
            ✕
          </button>

          <img
            src={images[slideIndex]}
            className="max-h-[80vh] rounded-lg"
          />

          {/* PREV */}
          <button
            className="absolute left-6 text-white text-4xl"
            onClick={() =>
              setSlideIndex((slideIndex - 1 + images.length) % images.length)
            }
          >
            ‹
          </button>

          {/* NEXT */}
          <button
            className="absolute right-6 text-white text-4xl"
            onClick={() => setSlideIndex((slideIndex + 1) % images.length)}
          >
            ›
          </button>
        </div>
      )}

      {/* CONTENT + RIGHT BOOKING BOX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

        {/* LEFT SIDE CONTENT */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="text-gray-700 whitespace-pre-line">{trip.description}</p>

          <p className="text-xl font-bold text-indigo-600">
            ₹ {trip.price} / person
          </p>
        </div>

        {/* RIGHT SIDE BOOKING SECTION */}
        <aside className="p-4 border rounded-xl shadow">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Starting from</span>
            <span className="text-xl font-bold text-indigo-600">₹{trip.price}</span>
          </div>

          <p className="text-xs text-gray-600 mb-3">
            {trip.days || "2"} Days / {trip.nights || "1"} Nights
          </p>

          <Link
            to={`/booking/${trip._id}`}
            className="block text-center rounded-xl bg-indigo-600 text-white py-2 font-semibold hover:bg-indigo-700"
          >
            Book Now
          </Link>

          <p className="text-[11px] text-gray-500 mt-2">
            Booking flow connected to backend with Razorpay and Pay at Property.
          </p>
        </aside>
      </div>
    </div>
  );
}
