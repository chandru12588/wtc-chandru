import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function AdminPackages() {
  const [packagesList, setPackagesList] = useState([]);

  /* ------------------------------
       LOAD ALL PACKAGES
  ------------------------------ */
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await api.get("/api/admin/packages");
        setPackagesList(res.data);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    loadPackages();
  }, []);

  /* ------------------------------
        DELETE PACKAGE
  ------------------------------ */
  const deletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await api.delete(`/api/admin/packages/${id}`);
      setPackagesList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete package");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Packages</h2>

        <a
          href="/admin/packages/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Package
        </a>
      </div>

      <div className="space-y-4">
        {packagesList.length === 0 ? (
          <p className="text-gray-500 text-sm">No packages found.</p>
        ) : (
          packagesList.map((pkg) => (
            <div
              key={pkg._id}
              className="flex items-center bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* IMAGE FALLBACK */}
              <img
                src={pkg.images?.[0] || "/no-image.png"}
                alt={pkg.title}
                className="w-20 h-20 rounded object-cover border"
              />

              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-lg">{pkg.title}</h3>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">₹{pkg.price}</span>
                </p>

                <p className="text-xs text-gray-600">
                  📍 {pkg.location || "No location"}
                </p>

                <p className="text-xs text-gray-600">
                  🌍 {pkg.region || "No region"}
                </p>

                <p className="text-xs text-gray-600">
                  🗂 Category: {pkg.category || "N/A"}
                </p>

                <p className="text-xs text-gray-600">
                  🕒 {pkg.days || "No duration"}
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href={`/admin/packages/${pkg._id}/edit`}
                  className="text-indigo-600 font-medium"
                >
                  Edit
                </a>

                <button
                  onClick={() => deletePackage(pkg._id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
