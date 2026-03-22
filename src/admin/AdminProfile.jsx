import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import PenguinLoader from "../components/PenguinLoader";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    const adminData = localStorage.getItem("wtc_admin");
    if (adminData) {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
    }
    setLoading(false);
  }, []);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      setMessageType("error");
      setMessage("Name and email are required");
      return;
    }

    setUpdating(true);
    try {
      const res = await api.post("/api/admin/profile/update", { name, email });
      const updated = { ...admin, ...res.data.admin };
      setAdmin(updated);
      localStorage.setItem("wtc_admin", JSON.stringify(updated));
      setMessageType("success");
      setMessage(res.data.message || "Profile updated successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Fill current password, new password, and confirm password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("New password and confirm password must match");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await api.post("/api/admin/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessageType("success");
      setMessage(res.data.message || "Password updated successfully");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <PenguinLoader message="Loading admin profile..." className="p-6" />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Admin Profile Settings</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {admin && (
        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
                <input
                  type="text"
                  value={admin._id}
                  readOnly
                  className="w-full px-3 py-2 border rounded text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <input
                  type="text"
                  value={admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Not available"}
                  readOnly
                  className="w-full px-3 py-2 border rounded text-sm bg-gray-100 cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded font-semibold transition mt-6"
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 text-white py-2 rounded font-semibold transition"
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


