import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";

export default function AdminPillionRequests() {
  const [requests, setRequests] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedRiders, setSelectedRiders] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/pillion-requests");
      setRequests(res.data.requests || []);
      setRiders(res.data.availableRiders || []);
    } catch (err) {
      console.error("Failed to load pillion requests", err);
      alert("Failed to load pillion requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (requestId) => {
    const assignedRiderId = selectedRiders[requestId];
    if (!assignedRiderId) {
      alert("Select an available rider first");
      return;
    }

    const notes = window.prompt("Admin notes (optional):", "") || "";
    try {
      await api.put(`/api/admin/pillion-requests/${requestId}/approve`, {
        assignedRiderId,
        notes,
      });
      await load();
    } catch (err) {
      console.error("Failed to approve pillion request", err);
      alert(
        err?.response?.data?.message || "Failed to approve pillion request"
      );
    }
  };

  const reject = async (requestId) => {
    const notes = window.prompt("Reason / notes (optional):", "") || "";
    try {
      await api.put(`/api/admin/pillion-requests/${requestId}/reject`, {
        notes,
      });
      await load();
    } catch (err) {
      console.error("Failed to reject pillion request", err);
      alert(
        err?.response?.data?.message || "Failed to reject pillion request"
      );
    }
  };

  if (loading) return <PenguinLoader message="Loading pillion requests..." />;

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Pillion Rider Requests</h2>

      {!requests.length && (
        <p className="text-sm text-gray-600">No pillion service requests yet.</p>
      )}

      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request._id} className="rounded-xl border bg-white p-4 shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {request.packageId?.title || "Pillion Rider Service"}
                </h3>
                <p className="text-sm text-gray-700">
                  {request.name} | {request.email} | {request.phone}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {request.startPoint} to {request.destination}
                </p>
                <p className="text-sm text-gray-600">
                  Start Date: {new Date(request.startDate).toLocaleDateString()} | Days: {request.numberOfDays}
                </p>
                <p className="text-sm text-gray-600">
                  Bike Brand: {request.bikeBrand}
                </p>
                {request.assignedRiderId && (
                  <p className="text-sm text-emerald-700">
                    Assigned Rider: {request.assignedRiderId.fullName} ({request.assignedRiderId.phone})
                  </p>
                )}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  request.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : request.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {request.status}
              </span>
            </div>

            {request.status === "pending" && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select
                  value={selectedRiders[request._id] || ""}
                  onChange={(e) =>
                    setSelectedRiders((prev) => ({
                      ...prev,
                      [request._id]: e.target.value,
                    }))
                  }
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select Available Rider</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.fullName} - {rider.phone}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => approve(request._id)}
                  className="rounded bg-emerald-600 px-4 py-2 text-sm text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(request._id)}
                  className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Reject
                </button>
              </div>
            )}

            {request.adminNotes && (
              <p className="mt-3 text-sm text-gray-700">
                <strong>Admin Notes:</strong> {request.adminNotes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


