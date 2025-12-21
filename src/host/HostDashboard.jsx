import React, { useEffect, useState } from "react";
import axios from "axios";
import { getHostToken, logoutHost, getHostUser } from "../utils/hostAuth";

export default function HostDashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [listings, setListings] = useState([]);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const host = getHostUser();
    try {
      const res = await axios.get(`${API}/api/host/listings/${host._id}`);
      setListings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Host Dashboard</h1>

      <button
        onClick={() => (window.location.href = "/host/add-listing")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add New Listing
      </button>

      <button
        onClick={() => { logoutHost(); window.location.href = "/"; }}
        className="ml-3 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <div className="mt-6 space-y-4">
        {listings.map((l) => (
          <div key={l._id} className="border p-4 rounded shadow-sm">
            <h2 className="font-bold">{l.title}</h2>
            <p>{l.location}</p>

            <p className="text-sm text-gray-500">
              Status: {l.approved ? "Approved" : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
