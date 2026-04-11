import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";

const STATUS_OPTIONS = ["new", "contacted", "closed"];

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminTravelAgentRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/kodaikanal-agents/quote-requests");
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ADMIN TRAVEL REQUESTS LOAD ERROR:", err);
      alert(err?.response?.data?.message || "Failed to load travel agent requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const syncAgents = async () => {
    setSyncing(true);
    try {
      const { data } = await api.post("/api/admin/kodaikanal-agents/sync");
      alert(data?.message || "Travel agents sync completed");
      await loadRequests();
    } catch (err) {
      console.error("ADMIN TRAVEL SYNC ERROR:", err);
      alert(err?.response?.data?.message || "Failed to sync travel agents");
    } finally {
      setSyncing(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/api/admin/kodaikanal-agents/quote-requests/${id}/status`, {
        status,
      });
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error("ADMIN TRAVEL REQUEST STATUS UPDATE ERROR:", err);
      alert(err?.response?.data?.message || "Failed to update request status");
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) return <PenguinLoader message="Loading travel agent requests..." />;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Travel Agent Quote Requests</h2>
        <button
          type="button"
          onClick={syncAgents}
          disabled={syncing}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {syncing ? "Syncing..." : "Sync Travel Agents"}
        </button>
      </div>

      {!items.length && (
        <p className="rounded-lg border bg-white p-4 text-sm text-gray-600">
          No quote requests yet.
        </p>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <article key={item._id} className="rounded-xl border bg-white p-4 shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">{item.customerName}</p>
                <p className="text-sm text-slate-700">
                  {item.phone}
                  {item.email ? ` | ${item.email}` : ""}
                </p>
                <p className="text-sm text-slate-700">
                  From: {item.fromCity} | Destination: {item.destination || "N/A"}
                  {item.destinationState ? ` (${item.destinationState})` : ""}
                </p>
                <p className="text-sm text-slate-700">
                  Travel Date: {formatDate(item.travelDate)} | Travelers: {item.travelers} |
                  Budget: Rs. {Number(item.budget || 0).toLocaleString("en-IN")}
                </p>
                {item.agent && (
                  <p className="text-sm text-emerald-700">
                    Selected Agent: {item.agent.name} ({item.agent.city}){" "}
                    {item.agent.phone ? `| ${item.agent.phone}` : ""}
                  </p>
                )}
                {item.notes && (
                  <p className="mt-2 text-sm text-slate-700">
                    <strong>Notes:</strong> {item.notes}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  Requested at: {formatDate(item.createdAt)}
                </p>
              </div>

              <div className="min-w-[170px]">
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                  Status
                </label>
                <select
                  value={item.status}
                  disabled={updatingId === item._id}
                  onChange={(e) => updateStatus(item._id, e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
