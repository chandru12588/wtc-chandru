import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { inferServiceType } from "../utils/serviceType";
import BookingForm from "../components/BookingForm";

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

export default function PillionRideRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  if (!pkg) return <div className="p-6">Loading...</div>;

  if (inferServiceType(pkg) !== "bike") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-gray-600">
          This package is not configured as a pillion rider service.
        </p>
        <button
          onClick={() => navigate(`/packages/${id}`)}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Back to package
        </button>
      </div>
    );
  }

  const descriptionPoints = getDescriptionPoints(pkg.description);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pt-28">
      <button
        onClick={() => navigate(`/packages/${id}`)}
        className="mb-5 text-indigo-600 hover:text-indigo-800"
      >
        Back to package
      </button>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_420px] md:items-stretch">
        <div className="min-w-0 md:min-h-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            Pillion Rider Service
          </p>
          <h1 className="mt-3 text-4xl font-bold">{pkg.title}</h1>
          <div className="mt-4 flex rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:h-[860px] md:min-h-0 md:flex-col">
            <div className="space-y-4 md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-3">
              {descriptionPoints.map((point, index) => (
                <p
                  key={`${index}-${point}`}
                  className="border-b border-stone-100 pb-4 text-[15px] leading-8 text-stone-700 last:border-b-0 last:pb-0"
                >
                  {point}
                </p>
              ))}
            </div>
          </div>
        </div>

        <BookingForm pkg={pkg} containerClassName="min-w-0 md:h-[860px]" />
      </div>
    </div>
  );
}
