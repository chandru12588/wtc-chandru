import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";

export default function AdminActingDrivers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/acting-drivers");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load acting driver applications", err);
      alert(
        err?.response?.data?.message ||
          "Failed to load acting driver applications"
      );
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
      await api.put(`/api/admin/acting-drivers/${id}/${status}`, { notes });
      await load();
    } catch (err) {
      console.error(`Failed to ${status} acting driver application`, err);
      alert(
        err?.response?.data?.message ||
          `Failed to ${status} acting driver application`
      );
    }
  };

  if (loading) {
    return <PenguinLoader message="Loading acting driver applications..." />;
  }

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Acting Driver Applications</h2>

      {!items.length && (
        <p className="text-sm text-gray-600">No acting driver applications yet.</p>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item._id} className="rounded-xl border bg-white p-4 shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{item.fullName}</h3>
                <p className="text-sm text-gray-700">
                  Phone: {item.phone} | WhatsApp: {item.whatsappNumber}
                </p>
                <p className="text-sm text-gray-600">
                  Age: {item.age} | Experience: {item.experienceYears || 0} year(s)
                </p>
                <p className="text-sm text-gray-600">
                  Vehicle: {String(item.vehicleType || "").toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  City/State: {item.city}, {item.state}
                </p>
                <p className="text-sm text-gray-600">Address: {item.address}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {item.licenseImageUrl ? (
                <a
                  href={item.licenseImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  View License Copy
                </a>
              ) : null}
              {item.livePhotoUrl ? (
                <a
                  href={item.livePhotoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-blue-600"
                >
                  View Live Photo
                </a>
              ) : null}
            </div>

            {item.adminReviewNotes ? (
              <p className="mt-3 text-sm text-gray-700">
                <strong>Admin Notes:</strong> {item.adminReviewNotes}
              </p>
            ) : null}

            {item.status === "pending" ? (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(item._id, "approve")}
                  className="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(item._id, "reject")}
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
