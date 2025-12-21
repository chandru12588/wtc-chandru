import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AdminHostBookings() {
  const [bookings, setBookings] = useState([]);

  const loadData = async () => {
    const res = await axios.get(`${API}/api/admin/host-bookings`);
    setBookings(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, action) => {
    const url = `${API}/api/admin/host-bookings/${action}/${id}`;
    await axios.put(url);
    alert(`Booking ${action} successfully`);
    loadData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Host Bookings</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Listing</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Dates</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td className="p-2 border">{b?.listingId?.title}</td>
              <td className="p-2 border">{b?.name}</td>
              <td className="p-2 border">
                {new Date(b.checkIn).toDateString()} →{" "}
                {new Date(b.checkOut).toDateString()}
              </td>
              <td className="p-2 border">₹{b.amount}</td>

              <td className="p-2 border">
                {b.bookingStatus === "pending" && (
                  <span className="text-yellow-600">Pending</span>
                )}
                {b.bookingStatus === "accepted" && (
                  <span className="text-green-600">Accepted</span>
                )}
                {b.bookingStatus === "rejected" && (
                  <span className="text-red-600">Rejected</span>
                )}
              </td>

              <td className="p-2 border">
                {b.paymentStatus === "paid" ? (
                  <span className="text-green-600 font-bold">PAID</span>
                ) : (
                  <span className="text-red-600 font-bold">UNPAID</span>
                )}
              </td>

              <td className="p-2 border space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => updateStatus(b._id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => updateStatus(b._id, "reject")}
                >
                  Reject
                </button>

                {b.paymentMode === "pay_at_property" &&
                  b.paymentStatus !== "paid" && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => updateStatus(b._id, "mark-paid")}
                    >
                      Mark Paid
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
