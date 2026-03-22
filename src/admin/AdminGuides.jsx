import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";

export default function AdminGuides() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/guides");
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load guide applications", err);
      alert(err?.response?.data?.message || "Failed to load guide applications");
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
      await api.put(`/api/admin/guides/${id}/${status}`, { notes });
      await load();
    } catch (err) {
      console.error(`Failed to ${status} guide application`, err);
      alert(
        err?.response?.data?.message ||
          `Failed to ${status} guide application`
      );
    }
  };

  if (loading) return <PenguinLoader message="Loading guide applications..." />;

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Guide Registration Requests</h2>

      {!items.length && (
        <p className="text-sm text-gray-600">No guide applications yet.</p>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item._id} className="rounded-xl border bg-white p-4 shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{item.fullName}</h3>
                <p className="text-sm text-gray-700">
                  {item.email} | {item.phone}
                </p>
                <p className="text-sm text-gray-600">
                  WhatsApp: {item.whatsappNumber}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {item.country}
                  {item.state ? `, ${item.state}` : ""}
                  {item.city ? `, ${item.city}` : ""}
                </p>
                <p className="text-sm text-gray-600">
                  Languages: {(item.languages || []).join(", ") || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Experience: {item.experienceYears || 0} year(s)
                </p>
                <p className="text-sm text-gray-600">
                  Private: {item.currencySymbol} {item.privateDayCharge} / day
                </p>
                <p className="text-sm text-gray-600">
                  Group: {item.currencySymbol} {item.groupDayCharge} / day
                </p>
                {item.specialties?.length ? (
                  <p className="text-sm text-gray-600">
                    Specialties: {item.specialties.join(", ")}
                  </p>
                ) : null}
                {item.guideLicense ? (
                  <p className="text-sm text-gray-600">
                    License: {item.guideLicense}
                  </p>
                ) : null}
                {item.notes ? (
                  <p className="mt-2 text-sm text-gray-700">
                    <strong>Guide Notes:</strong> {item.notes}
                  </p>
                ) : null}
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


