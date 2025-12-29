import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getHostUser, getHostToken } from "../utils/hostAuth";
import { Pencil, Trash2, Plus } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function HostDashboard() {
  const navigate = useNavigate();
  const host = getHostUser();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!host?._id) return;

    (async () => {
      try {
        const res = await axios.get(`${API}/api/host/listings/my/${host._id}`);
        setListings(res.data || []);
      } catch (e) {
        console.log("Load listing error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing permanently?")) return;

    try {
      await axios.delete(`${API}/api/host/listings/${id}`, {
        headers: { Authorization: getHostToken() },
      });

      setListings((prev) => prev.filter((l) => l._id !== id));
      alert("Listing deleted");
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-24 px-4 pb-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Host Dashboard</h1>

        <button
          onClick={() => navigate("/host/add-listing")}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full shadow hover:bg-emerald-700"
        >
          <Plus size={18} /> Add New Listing
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500 text-lg mt-10 text-center">
          No listings added yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <div key={l._id} className="border rounded-xl shadow p-3 bg-white">
              <img
                src={l.images?.[0] || "https://via.placeholder.com/200"}
                className="h-40 w-full rounded-lg object-cover"
              />

              <h3 className="font-bold text-lg mt-2">{l.title}</h3>
              <p className="text-sm text-gray-600">{l.location}</p>

              <p className="mt-2 font-semibold">
                ₹{l.price} <span className="text-gray-500 text-sm">/night</span>
              </p>

              <p className="text-xs bg-orange-200 px-2 py-1 rounded inline-block mt-1">
                {l.stayType || "Stay"}
              </p>

              <p
                className={`text-xs font-bold mt-2 ${
                  l.approved ? "text-green-600" : "text-red-500"
                }`}
              >
                {l.approved ? "Approved ✔" : "Pending Approval ⏳"}
              </p>

              <div className="flex justify-between mt-4">
                <Link
                  to={`/host/edit/${l._id}`}
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                >
                  <Pencil size={16} /> Edit
                </Link>

                <button
                  onClick={() => deleteListing(l._id)}
                  className="flex items-center gap-1 bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
