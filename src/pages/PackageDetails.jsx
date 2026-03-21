import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { api } from "../api.js";
import BookingForm from "../components/BookingForm.jsx";
import { inferServiceType } from "../utils/serviceType";
import { loadFavorites, toggleFavorite } from "../utils/wishlist";

const STAR_VALUES = [1, 2, 3, 4, 5];

function renderStars(value) {
  const rounded = Math.max(0, Math.min(5, Number(value || 0)));
  return STAR_VALUES.map((star) => (
    <FaStar
      key={star}
      className={star <= rounded ? "text-amber-400" : "text-gray-300"}
      size={14}
    />
  ));
}

export default function PackageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewMedia, setReviewMedia] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("wtc_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const loadReviews = async () => {
    try {
      setReviewLoading(true);
      const res = await api.get(`/api/reviews/package/${id}`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch {
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        try {
          const listingRes = await api.get(`/api/host/listings/${id}`);
          if (listingRes?.data?._id) {
            navigate(`/host-listing/${id}`, { replace: true });
            return;
          }
        } catch {
          // no-op fallback
        }

        console.log("PACKAGE ERROR:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
    loadReviews();
  }, [id, navigate]);

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("wtc_token")) {
      alert("Please login first to add your rating");
      navigate("/login");
      return;
    }

    try {
      setSubmittingReview(true);

      const formData = new FormData();
      formData.append("rating", String(reviewRating));
      formData.append("reviewText", reviewText);
      Array.from(reviewMedia || []).forEach((file) => {
        formData.append("media", file);
      });

      await api.post(`/api/reviews/package/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReviewText("");
      setReviewMedia([]);
      await Promise.all([
        loadReviews(),
        api.get(`/api/packages/${id}`).then((res) => setPkg(res.data)),
      ]);
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to save review now");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (error || !pkg) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500">Package not found or removed</h2>
        <button
          onClick={() => navigate("/trips")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = pkg.images?.length ? pkg.images : [pkg.image];
  const serviceType = inferServiceType(pkg);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <button
        onClick={() => navigate("/trips")}
        className="mb-4 flex items-center gap-2 font-semibold text-indigo-600"
      >
        Back to Trips
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{pkg.title}</h1>
          <p className="mt-2 text-gray-600">{pkg.region || "Beautiful Destination"}</p>
        </div>

        <div className="rounded-xl border px-4 py-3">
          <div className="flex items-center gap-1">{renderStars(Math.round(pkg.averageRating || 0))}</div>
          <p className="mt-1 text-sm text-gray-600">
            {(pkg.averageRating || 0).toFixed(1)} / 5 ({pkg.reviewCount || 0} reviews)
          </p>
        </div>
      </div>

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
          <p className="mt-3 whitespace-pre-line text-gray-700">{pkg.description}</p>
          <div className="mt-4 text-3xl font-bold text-indigo-600">Rs. {pkg.price}</div>

          {serviceType === "guide" && (
            <p className="mt-3 text-sm text-emerald-700">Tour guide service available for this package.</p>
          )}
        </div>

        <div>
          <BookingForm pkg={pkg} />
        </div>
      </div>

      <section className="mt-12 rounded-2xl border bg-white p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Ratings & Reviews</h2>
          <button
            type="button"
            onClick={() => navigate("/reviews")}
            className="rounded-full border border-emerald-600 px-4 py-1.5 text-sm font-medium text-emerald-700"
          >
            View All Reviews
          </button>
        </div>

        <form onSubmit={handleSubmitReview} className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Rate this package</p>
          <div className="mt-2 flex items-center gap-2">
            {STAR_VALUES.map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="rounded"
              >
                <FaStar
                  size={22}
                  className={star <= reviewRating ? "text-amber-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={3}
            placeholder="Share your experience"
            className="mt-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-emerald-500"
          />

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setReviewMedia(Array.from(e.target.files || []))}
            className="mt-3 block w-full text-sm"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="mt-3 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submittingReview ? "Saving..." : "Submit Review"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {reviewLoading ? <p className="text-sm text-gray-500">Loading reviews...</p> : null}

          {!reviewLoading && !reviews.length ? (
            <p className="text-sm text-gray-500">No reviews yet. Be the first to rate this package.</p>
          ) : null}

          {reviews.map((review) => (
            <div key={review._id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-gray-800">{review.userName || "Traveler"}</p>
                <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
              </div>
              {review.reviewText ? (
                <p className="mt-2 text-sm text-gray-700">{review.reviewText}</p>
              ) : null}

              {Array.isArray(review.media) && review.media.length ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {review.media.map((item, idx) =>
                    item.mediaType === "video" ? (
                      <video
                        key={`${review._id}-video-${idx}`}
                        controls
                        className="h-52 w-full rounded-xl object-cover"
                      >
                        <source src={item.url} />
                      </video>
                    ) : (
                      <img
                        key={`${review._id}-img-${idx}`}
                        src={item.url}
                        alt="Review media"
                        className="h-52 w-full rounded-xl object-cover"
                      />
                    )
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
