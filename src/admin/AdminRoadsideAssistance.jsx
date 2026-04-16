import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminRoadsideAssistance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await api.get("/api/admin/roadside-assistance");
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load roadside assistance", error);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    setSyncing(true);
    setSyncMessage("");
    try {
      const { data } = await api.post("/api/admin/roadside-assistance/sync");
      setSyncMessage(`Sync completed: ${JSON.stringify(data.summary)}`);
      loadItems();
    } catch (error) {
      setSyncMessage("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/api/admin/roadside-assistance/${id}/status`, {
        isActive: !currentStatus,
      });
      loadItems();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Roadside Assistance & Vehicle Services</h2>
        <button
          onClick={syncData}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {syncing ? "Syncing..." : "Sync from Apify"}
        </button>
      </div>

      {syncMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {syncMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Rating</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.phone}</td>
                <td className="px-4 py-2 border">{item.city}</td>
                <td className="px-4 py-2 border">{item.rating}</td>
                <td className="px-4 py-2 border">
                  {item.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => toggleStatus(item._id, item.isActive)}
                    className={`px-3 py-1 rounded text-white ${
                      item.isActive ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}