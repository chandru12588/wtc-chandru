import React, { useState } from "react";

export default function ActingDriverRegister() {
  const API = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    phone: "",
    whatsappNumber: "",
    vehicleType: "car",
    experienceYears: "",
  });
  const [licenseImage, setLicenseImage] = useState(null);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (licenseImage) fd.append("licenseImage", licenseImage);

      const res = await fetch(`${API}/api/acting-drivers/apply`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setMessageType("success");
      setMessage(
        "Acting driver application submitted. You will be notified after admin approval."
      );
      setForm({
        fullName: "",
        age: "",
        phone: "",
        whatsappNumber: "",
        vehicleType: "car",
        experienceYears: "",
      });
      setLicenseImage(null);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Acting Driver Registration</h1>
      <p className="mt-2 text-gray-600">
        Register as an acting driver for car or bike service.
      </p>

      {message && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm ${
            messageType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-6 space-y-5 rounded-xl bg-white p-5 shadow"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-lg border p-3"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            required
          />
          <input
            className="rounded-lg border p-3"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setField("age", e.target.value)}
            required
          />
          <input
            className="rounded-lg border p-3"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            required
          />
          <input
            className="rounded-lg border p-3"
            placeholder="WhatsApp Number"
            value={form.whatsappNumber}
            onChange={(e) => setField("whatsappNumber", e.target.value)}
            required
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border p-3"
            value={form.vehicleType}
            onChange={(e) => setField("vehicleType", e.target.value)}
            required
          >
            <option value="car">Car Driver</option>
            <option value="bike">Bike Driver</option>
          </select>
          <input
            className="rounded-lg border p-3"
            type="number"
            placeholder="Experience (years)"
            value={form.experienceYears}
            onChange={(e) => setField("experienceYears", e.target.value)}
            required
          />
        </div>

        <label className="block rounded-lg border p-3">
          <span className="text-sm text-gray-600">
            Upload Driving Licence Copy
          </span>
          <input
            type="file"
            className="mt-2 block w-full"
            accept="image/*,.pdf"
            onChange={(e) => setLicenseImage(e.target.files?.[0] || null)}
            required
          />
        </label>

        <button
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white"
        >
          {loading ? "Submitting..." : "Submit Driver Application"}
        </button>
      </form>
    </div>
  );
}
