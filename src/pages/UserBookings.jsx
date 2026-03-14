import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserBookings() {
  const API = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("wtc_user"));
  const userId = user?._id || user?.id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadBookings();
  }, [userId]);

  /* ================= LOAD BOOKINGS ================= */
  const loadBookings = async () => {
    try {
      setLoading(true);

      const [pkgRes, hostRes, pillionRes] = await Promise.all([
        axios.get(`${API}/api/bookings/user/${userId}`),
        axios.get(`${API}/api/host/bookings/user/${userId}`),
        axios.get(`${API}/api/pillion-requests/user/${userId}`),
      ]);

      const packages = pkgRes.data.map((b) => ({
        ...b,
        source: "package",
        finalStatus: b.status,
      }));

      const hosts = hostRes.data.map((b) => ({
        ...b,
        source: "host",
        finalStatus: b.bookingStatus,
      }));

      const pillionRequests = pillionRes.data.map((b) => ({
        ...b,
        source: "pillion",
        finalStatus: b.status,
        checkIn: b.startDate,
        checkOut: b.startDate,
        people: 1,
        amount: 0,
      }));

      const merged = [...packages, ...hosts, ...pillionRequests]
        .filter((b) => b.finalStatus !== "rejected")
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.checkIn) -
            new Date(a.createdAt || a.checkIn)
        );

      setBookings(merged);
    } catch (err) {
      console.error("LOAD BOOKINGS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CANCEL ================= */
  const cancelBooking = async (b) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const url =
        b.source === "host"
          ? `${API}/api/host/bookings/${b._id}/cancel`
          : `${API}/api/bookings/${b._id}/cancel`;

      await axios.put(url);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  const canCancel = (b) => {
    if (b.source === "pillion") return false;
    if (!["pending", "accepted"].includes(b.finalStatus)) return false;
    return new Date() < new Date(b.checkIn);
  };

  /* ================= UI ================= */
  if (!user)
    return (
      <div className="text-center py-20 text-gray-600">
        Please login to view bookings.
      </div>
    );

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading your bookings...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No bookings found.
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left font-semibold">
                  <th className="p-3">Trip</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">People</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {b.packageId?.title || b.listingId?.title || "—"}
                      {b.source === "host" && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          HOST
                        </span>
                      )}
                      {b.source === "pillion" && (
                        <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          PILLION
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-xs">
                      {b.source === "pillion" ? (
                        <>
                          {new Date(b.startDate).toLocaleDateString()}
                          <div>{b.numberOfDays} day(s)</div>
                        </>
                      ) : (
                        <>
                          {new Date(b.checkIn).toLocaleDateString()} →{" "}
                          {new Date(b.checkOut).toLocaleDateString()}
                        </>
                      )}
                    </td>

                    <td className="p-3">
                      {b.source === "pillion"
                        ? `${b.startPoint} → ${b.destination}`
                        : b.people || b.guests || 1}
                    </td>

                    <td className="p-3 font-semibold">
                      {b.source === "pillion" ? b.bikeBrand : `₹${b.amount}`}
                    </td>

                    <td
                      className={`p-3 font-semibold capitalize ${
                        b.finalStatus === "accepted"
                          ? "text-green-600"
                          : b.finalStatus === "cancelled"
                          ? "text-gray-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {b.finalStatus}
                    </td>

                    <td className="p-3 space-y-1">
                      {b.finalStatus === "accepted" && (
                        <a
                          href={`${API}/api/invoice/${b._id}`}
                          target="_blank"
                          className="block text-indigo-600 underline text-xs"
                        >
                          Download Invoice
                        </a>
                      )}

                      {canCancel(b) && (
                        <button
                          onClick={() => cancelBooking(b)}
                          className="text-red-600 text-xs underline"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="md:hidden space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-xl shadow p-4 space-y-2"
              >
                <div className="font-semibold text-lg">
                  {b.packageId?.title || b.listingId?.title}
                  {b.source === "host" && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 rounded">
                      HOST
                    </span>
                  )}
                  {b.source === "pillion" && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 rounded">
                      PILLION
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {b.source === "pillion"
                    ? `📅 ${new Date(b.startDate).toLocaleDateString()} • ${b.numberOfDays} day(s)`
                    : `📅 ${new Date(b.checkIn).toLocaleDateString()} → ${new Date(b.checkOut).toLocaleDateString()}`}
                </div>

                <div className="text-sm">
                  {b.source === "pillion"
                    ? `🏍 ${b.startPoint} → ${b.destination}`
                    : `👥 ${b.people || b.guests || 1}`}
                </div>
                <div className="font-semibold">
                  {b.source === "pillion" ? b.bikeBrand : `₹${b.amount}`}
                </div>

                <div
                  className={`font-semibold capitalize ${
                    b.finalStatus === "accepted"
                      ? "text-green-600"
                      : b.finalStatus === "cancelled"
                      ? "text-gray-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.finalStatus}
                </div>

                <div className="flex gap-4 pt-2">
                  {b.finalStatus === "accepted" && (
                    <a
                      href={`${API}/api/invoice/${b._id}`}
                      target="_blank"
                      className="text-indigo-600 underline text-sm"
                    >
                      Invoice
                    </a>
                  )}

                  {canCancel(b) && (
                    <button
                      onClick={() => cancelBooking(b)}
                      className="text-red-600 underline text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
