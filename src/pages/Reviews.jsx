import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { api } from "../api";

const STAR_VALUES = [1, 2, 3, 4, 5];

function Stars({ rating }) {
  const rounded = Math.max(1, Math.min(5, Math.round(Number(rating || 0))));
  return (
    <div className="flex items-center gap-1">
      {STAR_VALUES.map((star) => (
        <FaStar key={star} size={14} className={star <= rounded ? "text-amber-400" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [featured, setFeatured] = useState([]);
  const [mine, setMine] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [featuredRes, mineRes] = await Promise.all([
          api.get("/api/reviews/featured?limit=40"),
          api.get("/api/reviews/user/me"),
        ]);

        setFeatured(Array.isArray(featuredRes.data) ? featuredRes.data : []);
        setMine(Array.isArray(mineRes.data) ? mineRes.data : []);
      } catch {
        try {
          const featuredRes = await api.get("/api/reviews/featured?limit=40");
          setFeatured(Array.isArray(featuredRes.data) ? featuredRes.data : []);
        } catch {
          setFeatured([]);
        }
        setMine([]);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <p className="mt-1 text-sm text-gray-600">Real ratings from your customers.</p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">My Reviews</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {mine.length ? (
            mine.map((review) => (
              <article key={review._id} className="rounded-xl border bg-white p-4">
                <p className="font-medium">{review.packageId?.title || "Package"}</p>
                <div className="mt-1">
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-gray-700">{review.reviewText || "No text"}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">No personal reviews yet.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">What Travellers Say</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {featured.length ? (
            featured.map((review) => (
              <article key={review._id} className="rounded-xl border bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{review.userName || "Traveler"}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-gray-700">{review.reviewText || "Amazing trip"}</p>
                <p className="mt-2 text-xs text-gray-500">{review.packageId?.title || "Package"}</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">No featured reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
