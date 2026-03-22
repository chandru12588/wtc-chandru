import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";

export default function AdminBikeRiders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWithFallback = async (paths) => {
    let lastErr;
    for (const path of paths) {
      try {
        return await api.get(path);
      } catch (err) {
        lastErr = err;
        if (err?.response?.status !== 404) throw err;
      }
    }
    throw lastErr;
  };

  const putWithFallback = async (paths, payload) => {
    let lastErr;
    for (const path of paths) {
      try {
        return await api.put(path, payload);
      } catch (err) {
        lastErr = err;
        if (err?.response?.status !== 404) throw err;
      }
    }
    throw lastErr;
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getWithFallback([
        "/api/admin/bike-riders",
        "/admin/bike-riders",
      ]);
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load rider applications", err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to load rider applications";
      alert(`Failed to load rider applications: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const notes = window.prompt("Review notes (optional):", "") || "";
    try {
      await putWithFallback(
        [
          `/api/admin/bike-riders/${id}/${status}`,
          `/admin/bike-riders/${id}/${status}`,
        ],
        { notes }
      );
      await load();
    } catch (err) {
      console.error(`Failed to ${status} rider`, err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        `Failed to ${status} rider`;
      alert(`Failed to ${status} rider: ${serverMessage}`);
    }
  };

  if (loading) return <PenguinLoader message="Loading rider applications..." />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Bike Rider Applications</h2>

      {!items.length && <p className="text-sm text-gray-600">No applications yet.</p>}

      <div className="grid gap-4">
        {items.map((a) => (
          <div key={a._id} className="bg-white rounded-xl shadow p-4 border">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{a.fullName}</h3>
                <p className="text-sm text-gray-600">{a.email} | {a.phone}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Bike: {a.bikeBrand} {a.bikeModel} ({a.bikeRegistrationNumber})
                </p>
                <p className="text-sm text-gray-600">
                  RC: {a.rcNumber} | License: {a.licenseNumber}
                </p>
                <p className="text-sm text-gray-600">
                  State: {a.operatingState} | Cities: {(a.operatingCities || []).join(", ") || "N/A"}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  a.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : a.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {a.status}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-2 mt-3 text-sm">
              {a.rcImageUrl && (
                <a href={a.rcImageUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">
                  View RC
                </a>
              )}
              {a.licenseImageUrl && (
                <a href={a.licenseImageUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">
                  View License
                </a>
              )}
              {a.idProofImageUrl && (
                <a href={a.idProofImageUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">
                  View ID Proof
                </a>
              )}
            </div>

            {a.adminReviewNotes && (
              <p className="text-sm mt-2 text-gray-700">
                <strong>Review Notes:</strong> {a.adminReviewNotes}
              </p>
            )}

            {a.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(a._id, "approve")}
                  className="px-4 py-2 rounded bg-emerald-600 text-white text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(a._id, "reject")}
                  className="px-4 py-2 rounded bg-red-600 text-white text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


