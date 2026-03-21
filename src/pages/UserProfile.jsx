import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/auth/me");
        const user = res.data?.user || {};
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          dob: user.dob ? String(user.dob).split("T")[0] : "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setSaving(true);
      const res = await api.put("/api/auth/profile", {
        name: form.name,
        phone: form.phone,
        dob: form.dob || null,
      });

      const user = res.data?.user || {};
      localStorage.setItem("wtc_user", JSON.stringify(user));
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="pt-28 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-14 pt-28">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <p className="mt-1 text-gray-600">View and edit your account details.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        {message ? <p className="rounded-lg bg-green-50 p-3 text-green-700">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p> : null}

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            className="w-full rounded-lg border bg-gray-50 px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mobile Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={onChange}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Edit Profile"}
        </button>
      </form>
    </div>
  );
}
