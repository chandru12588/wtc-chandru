import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { api } from "../api";
import { inferServiceType } from "../utils/serviceType";

export default function PillionRideRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("wtc_user"));

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    startPoint: "",
    destination: "",
    startDate: "",
    numberOfDays: 1,
    bikeBrand: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setPkg(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/pillion-requests`, {
        userId: user._id || user.id,
        packageId: id,
        ...form,
      });

      alert(
        "Pillion rider request submitted. Admin will assign an available rider and confirm."
      );
      navigate("/my-bookings");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return <div className="p-6">Loading...</div>;

  if (inferServiceType(pkg) !== "bike") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-gray-600">
          This package is not configured as a pillion rider service.
        </p>
        <button
          onClick={() => navigate(`/packages/${id}`)}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Back to package
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pt-28">
      <button
        onClick={() => navigate(`/packages/${id}`)}
        className="mb-5 text-indigo-600 hover:text-indigo-800"
      >
        Back to package
      </button>

      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            Pillion Rider Service
          </p>
          <h1 className="mt-3 text-4xl font-bold">{pkg.title}</h1>
          <p className="mt-3 text-gray-600">{pkg.description}</p>
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-gray-700">
            Submit your route details here. Admin will review your request,
            assign an available rider, and then send confirmation.
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-5 shadow-lg space-y-4"
        >
          <h2 className="text-xl font-semibold">Request a Rider</h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Your Name"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            className="w-full rounded-lg border p-3"
            placeholder="Your Email"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Phone Number"
            required
          />
          <input
            name="startPoint"
            value={form.startPoint}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Start From"
            required
          />
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Destination"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border p-3"
              required
            />
            <input
              type="number"
              min="1"
              name="numberOfDays"
              value={form.numberOfDays}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              placeholder="Days"
              required
            />
          </div>

          <input
            name="bikeBrand"
            value={form.bikeBrand}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            placeholder="Preferred Bike Brand"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white"
          >
            {loading ? "Submitting..." : "Submit Rider Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
