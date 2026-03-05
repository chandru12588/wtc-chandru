import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Get admin ID from localStorage or session
    const adminData = localStorage.getItem("admin_user");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setUsername(parsed.username || "");
      setEmail(parsed.email || "");
    }
    setLoading(false);
  }, []);

  const handleUpdateProfile = async () => {
    if (!username || !email) {
      setMessage("❌ Username and email are required");
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/profile/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          adminId: admin._id,
          username,
          email
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ Profile updated successfully");
      
      // Update localStorage
      const updated = { ...admin, username, email };
      localStorage.setItem("admin_user", JSON.stringify(updated));
      setAdmin(updated);
    } catch (err) {
      setMessage("❌ Failed to update profile: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Profile Settings</h2>

      {message && (
        <div className={`p-4 mb-4 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      {admin && (
        <div className="max-w-md bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {/* Admin ID (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
              <input
                type="text"
                value={admin._id}
                readOnly
                className="w-full px-3 py-2 border rounded text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-3 py-2 border rounded text-sm"
              />
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <input
                type="text"
                value={new Date(admin.createdAt).toLocaleDateString()}
                readOnly
                className="w-full px-3 py-2 border rounded text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded font-semibold transition mt-6"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
