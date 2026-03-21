import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { api } from "../api";

function Stars({ rating }) {
  const rounded = Math.max(1, Math.min(5, Math.round(Number(rating || 0))));
  return (
    <div className="mt-1 flex text-yellow-500">
      {Array.from({ length: 5 }).map((_, idx) => (
        <Star
          key={idx}
          size={16}
          fill={idx < rounded ? "gold" : "none"}
          color={idx < rounded ? "gold" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/reviews/featured?limit=8");
        setTestimonials(Array.isArray(res.data) ? res.data : []);
      } catch {
        setTestimonials([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!testimonials.length) return undefined;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-2 text-center text-xl font-semibold">What Our Travellers Say</h2>
        <p className="text-center text-sm text-gray-500">No testimonials yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-6 text-center text-xl font-semibold">What Our Travellers Say</h2>

      <div className="relative h-[220px] sm:h-[190px]">
        {testimonials.map((t, i) => (
          <div
            key={t._id || i}
            className={`absolute inset-0 px-6 transition-all duration-700 ${
              i === index ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-emerald-50 font-semibold text-emerald-700">
                {(t.userName || "T").slice(0, 1).toUpperCase()}
              </div>

              <div>
                <p className="mb-2 line-clamp-3 text-sm text-gray-700">
                  {t.reviewText || "Great experience"}
                </p>
                <p className="font-semibold">{t.userName || "Traveler"}</p>
                <p className="text-xs text-gray-500">{t.packageId?.title || "Trip"}</p>
                <Stars rating={t.rating} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition ${i === index ? "bg-emerald-600" : "bg-gray-300"}`}
            aria-label={`testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
