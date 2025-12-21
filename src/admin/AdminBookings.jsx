import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- LOAD BOOKINGS ---------------- */
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/admin/all");
      setBookings(res.data || []);
    } catch (err) {
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (booking, status) => {
    if (!confirm(`Are you sure you want to ${status} this booking?`)) return;

    try {
      const url =
        booking.source === "host"
          ? `/api/admin/bookings/host/${booking._id}/status`
          : `/api/bookings/${booking._id}/status`;

      await api.put(url, { status });
      alert(`Booking ${status}`);
      loadBookings();
    } catch {
      alert("Failed to update booking");
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => (tab === "all" ? true : b.status === tab))
      .filter((b) => {
        const q = search.toLowerCase();
        return (
          b.name?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          b.email?.toLowerCase().includes(q) ||
          b.packageId?.title?.toLowerCase().includes(q)
        );
      });
  }, [bookings, tab, search]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "-";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold">Admin Bookings</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin")}
            className="px-3 md:px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
          >
            ← Dashboard
          </button>

          <button
            onClick={loadBookings}
            className="px-3 md:px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* TABS + SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                tab === s
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name / phone / email / package"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left font-semibold">
              <th className="p-3">Package</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Contact</th>
              <th className="p-3">People</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Docs</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {b.packageId?.title || "-"}
                    {b.source === "host" && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        HOST
                      </span>
                    )}
                  </td>

                  <td className="p-3 font-semibold">{b.name}</td>

                  <td className="p-3">
                    <div>{b.phone}</div>
                    <div className="text-xs text-gray-500">{b.email}</div>
                  </td>

                  <td className="p-3">{b.people}</td>

                  <td className="p-3 text-xs">
                    <div>IN: {formatDate(b.checkIn)}</div>
                    <div>OUT: {formatDate(b.checkOut)}</div>
                  </td>

                  <td className="p-3 font-semibold">₹{b.amount}</td>

                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        b.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {b.paymentStatus?.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        b.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : b.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">
                    {b.idProofUrl ? (
                      <a
                        href={b.idProofUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3">
                    {b.status === "accepted" ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL}/api/invoice/${b._id}`}
                        target="_blank"
                        className="text-indigo-600 underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Not ready</span>
                    )}
                  </td>

                  <td className="p-3 space-y-1">
                    <button
                      onClick={() => updateStatus(b, "accepted")}
                      disabled={b.status !== "pending"}
                      className={`w-full px-3 py-1 rounded text-xs text-white ${
                        b.status !== "pending"
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(b, "rejected")}
                      disabled={b.status !== "pending"}
                      className={`w-full px-3 py-1 rounded text-xs text-white ${
                        b.status !== "pending"
                          ? "bg-gray-400"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    
  );
}
