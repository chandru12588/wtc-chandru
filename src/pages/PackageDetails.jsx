import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { api } from "../api.js";
import BookingForm from "../components/BookingForm.jsx";
import { inferServiceType } from "../utils/serviceType";
import { loadFavorites, toggleFavorite } from "../utils/wishlist";

function getDescriptionPoints(description) {
  const text = String(description || "").trim();
  if (!text) return [];

  const linePoints = text
    .split(/\r?\n+/)
    .map((line) => line.replace(/^(\d+[\).\s-]*|[-*]\s*)/, "").trim())
    .filter(Boolean);

  if (linePoints.length > 1) return linePoints;

  return text
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ added
  const [error, setError] = useState(false);      // ✅ added

  const [showSlider, setShowSlider] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.log("PACKAGE ERROR:", err);

        // 🔥 IMPORTANT FIX
        setError(true);
      } finally {
        setLoading(false); // 🔥 stop infinite loading
      }
    };

    load();
  }, [id]);

  // ✅ Loading UI
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // ✅ Error UI (NO MORE STUCK SCREEN 🔥)
  if (error || !pkg) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          Package not found or removed ❌
        </h2>

        <button
          onClick={() => navigate("/trips")}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = pkg.images?.length ? pkg.images : [pkg.image];
  const serviceType = inferServiceType(pkg);
  const descriptionPoints = getDescriptionPoints(pkg.description);

  useEffect(() => {
    let mounted = true;

    const syncFavorite = async () => {
      try {
        const list = await loadFavorites();
        if (!mounted) return;
        setIsFavorite(list.some((fav) => String(fav.itemId) === String(pkg?._id)));
      } catch {
        if (!mounted) return;
        setIsFavorite(false);
      }
    };

    if (pkg?._id) syncFavorite();
    return () => {
      mounted = false;
    };
  }, [pkg?._id]);

  const handleFavorite = async () => {
    try {
      const result = await toggleFavorite(pkg);
      setIsFavorite(Boolean(result?.favorite));
    } catch {
      alert("Unable to update favorite right now");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <button
        onClick={() => navigate("/trips")}
        className="mb-4 flex items-center gap-2 font-semibold text-indigo-600"
      >
        Back to Trips
      </button>

      <h1 className="text-4xl font-bold">{pkg.title}</h1>
      <p className="mt-2 text-gray-600">
        {pkg.region || "Beautiful Destination"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="relative row-span-2 md:col-span-2">
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/70 bg-black/35 p-3 shadow-lg backdrop-blur-sm"
            aria-label="Toggle favorite"
          >
            <FaHeart className={isFavorite ? "text-red-500" : "text-white"} />
          </button>
          <img
            src={images[0]}
            alt={pkg.title}
            onClick={() => {
              setSlideIndex(0);
              setShowSlider(true);
            }}
            className="h-[420px] w-full cursor-pointer rounded-xl object-cover"
          />
        </div>

        {images.slice(1, 5).map((img, index) => (
          <div key={img || index}>
            <img
              src={img}
              alt={`${pkg.title} ${index + 2}`}
              onClick={() => {
                setSlideIndex(index + 1);
                setShowSlider(true);
              }}
              className="h-[200px] w-full cursor-pointer rounded-xl object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <h2 className="text-2xl font-semibold">About this trip</h2>

          <p className="mt-3 whitespace-pre-line text-gray-700">
            {pkg.description}
          </p>

          <div className="mt-4 text-3xl font-bold text-indigo-600">
            Rs. {pkg.price}
          </div>
        </div>

        <div>
          <BookingForm pkg={pkg} />
        </div>
      </div>
    </div>
  );
}
