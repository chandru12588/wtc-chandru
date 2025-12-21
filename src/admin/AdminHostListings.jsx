import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminHostListings() {
  const [listings, setListings] = useState([]);

  const load = async () => {
    const res = await api.get("/api/admin/host-listings");
    setListings(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.put(`/api/admin/host-listings/approve/${id}`);
    load();
  };

  const reject = async (id) => {
    await api.put(`/api/admin/host-listings/reject/${id}`);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete listing?")) return;
    await api.delete(`/api/admin/host-listings/${id}`);
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Host Submitted Listings</h2>

      {listings.map((l) => (
        <div key={l._id} className="border p-4 rounded mb-3">
          <h3 className="font-semibold">{l.title}</h3>
          <p>{l.description}</p>
          <p><b>Host:</b> {l.hostId?.name}</p>

          <div className="flex gap-2 mt-2">
            {!l.approved ? (
              <>
                <button
                  onClick={() => approve(l._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(l._id)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </>
            ) : (
              <span className="text-green-700 font-semibold">Approved</span>
            )}

            <button
              onClick={() => remove(l._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
