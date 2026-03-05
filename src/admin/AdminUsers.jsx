import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [changing, setChanging] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`${API}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setMessage("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Get user details including password
  const handleSelectUser = async (user) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await res.json();
      setSelectedUser(userData);
      setNewPassword("");
      setMessage("");
    } catch (err) {
      setMessage("Failed to load user details");
    }
  };

  // Change user password
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    setChanging(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/users/${selectedUser._id}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ Password changed successfully");
      setNewPassword("");
      setSelectedUser(null);

      // Refresh users list
      const refreshRes = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const refreshData = await refreshRes.json();
      setUsers(refreshData);
    } catch (err) {
      setMessage("❌ Failed to change password: " + err.message);
    } finally {
      setChanging(false);
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      {message && (
        <div className={`p-4 mb-4 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold">All Users ({users.length})</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {users.map(user => (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition ${
                  selectedUser?._id === user._id ? "bg-blue-100" : ""
                }`}
              >
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Details & Change Password */}
        {selectedUser && (
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">User Details</h3>

            {/* User Info */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{selectedUser.phone || "N/A"}</p>
              </div>

              {/* Password Display */}
              <div className="bg-gray-50 p-4 rounded mt-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">Current Password Hash</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword[selectedUser._id] ? "text" : "password"}
                    value={selectedUser.password || "No password set"}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded text-sm bg-white"
                  />
                  <button
                    onClick={() =>
                      setShowPassword(prev => ({
                        ...prev,
                        [selectedUser._id]: !prev[selectedUser._id]
                      }))
                    }
                    className="p-2 hover:bg-gray-200 rounded transition"
                  >
                    {showPassword[selectedUser._id] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3">Change User Password</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={changing || !newPassword}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-2 rounded font-semibold transition"
                >
                  {changing ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
