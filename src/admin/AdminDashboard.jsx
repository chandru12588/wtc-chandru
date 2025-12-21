import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    upcomingTrips: 0,
    topDestinations: [],
    monthlyData: [],
    bookingTrend: [],
    recentBookings: []
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        console.log("ADMIN STATS:", data); // DEBUG
        setStats(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const formatINR = (num) =>
    num?.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const formatDate = (date) => {
    if (!date) return "No Date";
    const d = new Date(date);
    return isNaN(d) ? "No Date" : d.toLocaleDateString("en-IN");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 shadow rounded-xl">
          <h2 className="text-sm text-gray-500">Total Bookings</h2>
          <p className="text-2xl font-semibold">{stats.totalBookings}</p>
        </div>

        <div className="bg-white p-5 shadow rounded-xl">
          <h2 className="text-sm text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-semibold">₹ {formatINR(stats.totalRevenue)}</p>
        </div>

        <div className="bg-white p-5 shadow rounded-xl">
          <h2 className="text-sm text-gray-500">Upcoming Trips</h2>
          <p className="text-2xl font-semibold">{stats.upcomingTrips}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 shadow rounded-xl">
          <h2 className="text-sm font-semibold mb-2">Monthly Revenue</h2>
          <Bar
            data={{
              labels: stats.monthlyData.map((d) => d.month),
              datasets: [
                {
                  label: "Revenue (₹)",
                  data: stats.monthlyData.map((d) => d.revenue),
                  backgroundColor: "rgba(16, 185, 129, 0.6)",
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-5 shadow rounded-xl">
          <h2 className="text-sm font-semibold mb-2">Booking Trend</h2>
          <Line
            data={{
              labels: stats.bookingTrend.map((d) => d.date),
              datasets: [
                {
                  label: "Bookings",
                  data: stats.bookingTrend.map((d) => d.count),
                  borderColor: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white mt-6 p-5 shadow rounded-xl overflow-x-auto">
        <h2 className="text-sm font-semibold mb-3">Recent Bookings</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Trip</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {stats.recentBookings?.length > 0 ? (
              stats.recentBookings.map((b, i) => (
                <tr key={i} className="text-center">
                  <td className="border p-2">{b.name}</td>
                  <td className="border p-2">{b.phone}</td>
                  <td className="border p-2">{b.email}</td>

                  {/* USE b.trip FROM BACKEND */}
                  <td className="border p-2">{b.trip}</td>

                  <td className="border p-2">₹ {formatINR(b.amount)}</td>

                  {/* USE unified b.date */}
                  <td className="border p-2">{formatDate(b.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TOP DESTINATIONS */}
      <div className="bg-white mt-6 p-5 shadow rounded-xl">
        <h2 className="text-sm font-semibold mb-3">Top Destinations</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          {stats.topDestinations.map((d, i) => (
            <li key={i}>
              {i + 1}. {d.location} — {d.count} bookings
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
