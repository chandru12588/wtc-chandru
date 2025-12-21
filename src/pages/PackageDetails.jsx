// frontend/src/pages/PackageDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import BookingForm from "../components/BookingForm.jsx";

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, [id]);

  if (!pkg) return <div className="p-6">Loading…</div>;

  const images = pkg.images?.length ? pkg.images : [pkg.image];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* ------------------------------- */}
      {/* TITLE */}
      {/* ------------------------------- */}
      <h1 className="text-4xl font-bold">{pkg.title}</h1>
      <p className="text-gray-600 mt-2">{pkg.region || "Beautiful Destination"}</p>

      {/* ------------------------------- */}
      {/* AIRBNB STYLE IMAGE GALLERY */}
      {/* ------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">

        {/* Main Large Image */}
        <div className="md:col-span-2 row-span-2">
          <img
            src={images[0]}
            onClick={() => { setSlideIndex(0); setShowSlider(true); }}
            className="w-full h-[420px] object-cover rounded-xl cursor-pointer"
          />
        </div>

        {/* Small Images */}
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="">
            <img
              src={img}
              onClick={() => { setSlideIndex(i + 1); setShowSlider(true); }}
              className="w-full h-[200px] object-cover rounded-xl cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* If more than 5 images */}
      {images.length > 5 && (
        <button
          onClick={() => { setSlideIndex(0); setShowSlider(true); }}
          className="mt-3 underline text-gray-700"
        >
          View all photos ({images.length})
        </button>
      )}

      {/* ------------------------------- */}
      {/* FULLSCREEN IMAGE SLIDER */}
      {/* ------------------------------- */}
      {showSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setShowSlider(false)}
          >
            ✕
          </button>

          <img
            src={images[slideIndex]}
            className="max-h-[80vh] rounded-xl"
          />

          {/* NEXT / PREV BUTTONS */}
          <button
            className="absolute left-6 text-white text-4xl"
            onClick={() => setSlideIndex((slideIndex - 1 + images.length) % images.length)}
          >
            ‹
          </button>

          <button
            className="absolute right-6 text-white text-4xl"
            onClick={() => setSlideIndex((slideIndex + 1) % images.length)}
          >
            ›
          </button>
        </div>
      )}

      {/* ------------------------------- */}
      {/* CONTENT + BOOKING FORM */}
      {/* ------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">

        {/* LEFT SIDE CONTENT */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">About this trip</h2>
          <p className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
            {pkg.description}
          </p>

          <div className="mt-4 text-3xl font-bold text-indigo-600">
            ₹ {pkg.price}
          </div>
        </div>

        {/* RIGHT SIDE BOOKING CARD */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-28">
            <h2 className="font-semibold mb-3">Book This Package</h2>
            <BookingForm pkg={pkg} />
          </div>
        </div>

      </div>
    </div>
  );
}
