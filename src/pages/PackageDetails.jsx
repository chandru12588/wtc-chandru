import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import BookingForm from "../components/BookingForm.jsx";
import { inferServiceType } from "../utils/serviceType";

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (!pkg) return <div className="p-6">Loading...</div>;

  const images = pkg.images?.length ? pkg.images : [pkg.image];
  const serviceType = inferServiceType(pkg);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <button
        onClick={() => navigate("/trips")}
        className="mb-4 flex items-center gap-2 font-semibold text-indigo-600 transition hover:scale-105 hover:text-indigo-800"
      >
        Back to Trips
      </button>

      <h1 className="text-4xl font-bold">{pkg.title}</h1>
      <p className="mt-2 text-gray-600">
        {pkg.region || "Beautiful Destination"}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="row-span-2 md:col-span-2">
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

      {images.length > 5 && (
        <button
          onClick={() => {
            setSlideIndex(0);
            setShowSlider(true);
          }}
          className="mt-3 text-gray-700 underline"
        >
          View all photos ({images.length})
        </button>
      )}

      {showSlider && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <button
            className="absolute right-4 top-4 text-3xl text-white"
            onClick={() => setShowSlider(false)}
          >
            X
          </button>

          <img
            src={images[slideIndex]}
            alt={`${pkg.title} ${slideIndex + 1}`}
            className="max-h-[80vh] rounded-xl"
          />

          <button
            className="absolute left-6 text-4xl text-white"
            onClick={() =>
              setSlideIndex((slideIndex - 1 + images.length) % images.length)
            }
          >
            {"<"}
          </button>

          <button
            className="absolute right-6 text-4xl text-white"
            onClick={() => setSlideIndex((slideIndex + 1) % images.length)}
          >
            {">"}
          </button>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">About this trip</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-700">
            {pkg.description}
          </p>

          <div className="mt-4 text-3xl font-bold text-indigo-600">
            Rs. {pkg.price}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-28 rounded-xl bg-white p-4 shadow-lg">
            {serviceType === "bike" ? (
              <div className="space-y-4">
                <h2 className="font-semibold">Request Pillion Rider Service</h2>
                <p className="text-sm text-gray-600">
                  Choose your route, trip date, days, and preferred bike brand
                  on the next page.
                </p>
                <button
                  onClick={() => navigate(`/pillion-request/${pkg._id}`)}
                  className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white"
                >
                  Continue to Rider Request
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-3 font-semibold">Book This Package</h2>
                <BookingForm pkg={pkg} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
