import React, { useState } from "react";
import { SERVICE_COUNTRIES } from "../constants/countries";

export default function GuideRegister() {
  const API = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    languages: "",
    experienceYears: "",
    specialties: "",
    guideLicense: "",
    notes: "",
  });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/guides/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setMessageType("success");
      setMessage("Guide application submitted. Admin review is pending.");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
        languages: "",
        experienceYears: "",
        specialties: "",
        guideLicense: "",
        notes: "",
      });
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Tour Guide Registration</h1>
      <p className="mt-2 text-gray-600">
        Register as a guide for supported destinations across our travel network.
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

      <form onSubmit={submit} className="mt-6 space-y-5 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border p-3" placeholder="Full Name" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} required />
          <input className="rounded-lg border p-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
          <input className="rounded-lg border p-3" placeholder="Phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} required />
          <input className="rounded-lg border p-3" placeholder="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => setField("whatsappNumber", e.target.value)} required />
          <select className="rounded-lg border p-3" value={form.country} onChange={(e) => setField("country", e.target.value)} required>
            <option value="">Select Country</option>
            {SERVICE_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <input className="rounded-lg border p-3" placeholder="State" value={form.state} onChange={(e) => setField("state", e.target.value)} required />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded-lg border p-3" placeholder="City / Base Location" value={form.city} onChange={(e) => setField("city", e.target.value)} required />
          <input className="rounded-lg border p-3" placeholder="Zipcode" value={form.zipcode} onChange={(e) => setField("zipcode", e.target.value)} required />
          <input className="rounded-lg border p-3" type="number" placeholder="Experience (years)" value={form.experienceYears} onChange={(e) => setField("experienceYears", e.target.value)} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-lg border p-3" placeholder="Languages (comma separated)" value={form.languages} onChange={(e) => setField("languages", e.target.value)} />
          <input className="rounded-lg border p-3" placeholder="Specialties (trekking, local tours, heritage)" value={form.specialties} onChange={(e) => setField("specialties", e.target.value)} />
        </div>

        <input className="w-full rounded-lg border p-3" placeholder="Guide License / Certificate (optional)" value={form.guideLicense} onChange={(e) => setField("guideLicense", e.target.value)} />
        <textarea className="w-full rounded-lg border p-3" rows={4} placeholder="Tell us about your routes, expertise, or service areas" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />

        <button disabled={loading} className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white">
          {loading ? "Submitting..." : "Submit Guide Application"}
        </button>
      </form>
    </div>
  );
}
