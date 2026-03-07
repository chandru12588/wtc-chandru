import React, { useState } from "react";

export default function BikeRiderRegister() {
  const API = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    operatingCities: "",
    preferredRoutes: "",
    bikeBrand: "",
    bikeModel: "",
    bikeYear: "",
    bikeRegistrationNumber: "",
    rcNumber: "",
    licenseNumber: "",
    idProofType: "Aadhaar",
    idProofNumber: "",
    experienceYears: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    additionalNotes: "",
    hasPillionHelmet: true,
    hasExtraGear: false,
  });

  const [docs, setDocs] = useState({
    rcImage: null,
    licenseImage: null,
    idProofImage: null,
    bikeImages: [],
  });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (docs.rcImage) fd.append("rcImage", docs.rcImage);
      if (docs.licenseImage) fd.append("licenseImage", docs.licenseImage);
      if (docs.idProofImage) fd.append("idProofImage", docs.idProofImage);
      for (const img of docs.bikeImages) fd.append("bikeImages", img);

      const res = await fetch(`${API}/api/bike-riders/apply`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setMessageType("success");
      setMessage("Application submitted. You will be notified after admin approval.");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        operatingCities: "",
        preferredRoutes: "",
        bikeBrand: "",
        bikeModel: "",
        bikeYear: "",
        bikeRegistrationNumber: "",
        rcNumber: "",
        licenseNumber: "",
        idProofType: "Aadhaar",
        idProofNumber: "",
        experienceYears: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        additionalNotes: "",
        hasPillionHelmet: true,
        hasExtraGear: false,
      });
      setDocs({ rcImage: null, licenseImage: null, idProofImage: null, bikeImages: [] });
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Bike Rider Partner Registration</h1>
      <p className="text-gray-600 mt-2">
        Service currently available only in Tamil Nadu (hill stations and tour routes).
        We plan to expand all over India soon.
      </p>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            messageType === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-5 bg-white p-5 rounded-xl shadow">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded-lg p-3" placeholder="Full Name" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} required />
          <input className="border rounded-lg p-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
          <input className="border rounded-lg p-3" placeholder="Phone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} required />
          <input className="border rounded-lg p-3" type="date" value={form.dob} onChange={(e) => setField("dob", e.target.value)} required />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded-lg p-3" placeholder="Operating Cities (comma separated)" value={form.operatingCities} onChange={(e) => setField("operatingCities", e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Preferred Routes (comma separated)" value={form.preferredRoutes} onChange={(e) => setField("preferredRoutes", e.target.value)} />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <input className="border rounded-lg p-3" placeholder="Bike Brand" value={form.bikeBrand} onChange={(e) => setField("bikeBrand", e.target.value)} required />
          <input className="border rounded-lg p-3" placeholder="Bike Model" value={form.bikeModel} onChange={(e) => setField("bikeModel", e.target.value)} required />
          <input className="border rounded-lg p-3" type="number" placeholder="Bike Year" value={form.bikeYear} onChange={(e) => setField("bikeYear", e.target.value)} />
        </div>

        <input className="border rounded-lg p-3 w-full" placeholder="Bike Registration Number" value={form.bikeRegistrationNumber} onChange={(e) => setField("bikeRegistrationNumber", e.target.value)} required />

        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded-lg p-3" placeholder="RC Number" value={form.rcNumber} onChange={(e) => setField("rcNumber", e.target.value)} required />
          <input className="border rounded-lg p-3" placeholder="Driving License Number" value={form.licenseNumber} onChange={(e) => setField("licenseNumber", e.target.value)} required />
          <select className="border rounded-lg p-3" value={form.idProofType} onChange={(e) => setField("idProofType", e.target.value)} required>
            <option value="Aadhaar">Aadhaar</option>
            <option value="PAN">PAN</option>
            <option value="Passport">Passport</option>
            <option value="Voter ID">Voter ID</option>
          </select>
          <input className="border rounded-lg p-3" placeholder="ID Proof Number" value={form.idProofNumber} onChange={(e) => setField("idProofNumber", e.target.value)} required />
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded-lg p-3" type="number" placeholder="Riding Experience (years)" value={form.experienceYears} onChange={(e) => setField("experienceYears", e.target.value)} />
          <input className="border rounded-lg p-3" placeholder="Emergency Contact Name" value={form.emergencyContactName} onChange={(e) => setField("emergencyContactName", e.target.value)} />
          <input className="border rounded-lg p-3 md:col-span-2" placeholder="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={(e) => setField("emergencyContactPhone", e.target.value)} />
        </div>

        <textarea className="border rounded-lg p-3 w-full" rows={3} placeholder="Additional Notes (optional)" value={form.additionalNotes} onChange={(e) => setField("additionalNotes", e.target.value)} />

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.hasPillionHelmet} onChange={(e) => setField("hasPillionHelmet", e.target.checked)} />
            Pillion helmet available
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.hasExtraGear} onChange={(e) => setField("hasExtraGear", e.target.checked)} />
            Extra safety gear available
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="border rounded-lg p-3 block">
            <span className="text-sm text-gray-600">Upload RC Photo</span>
            <input type="file" className="mt-2 block w-full" accept="image/*" onChange={(e) => setDocs((p) => ({ ...p, rcImage: e.target.files?.[0] || null }))} required />
          </label>
          <label className="border rounded-lg p-3 block">
            <span className="text-sm text-gray-600">Upload License Photo</span>
            <input type="file" className="mt-2 block w-full" accept="image/*" onChange={(e) => setDocs((p) => ({ ...p, licenseImage: e.target.files?.[0] || null }))} required />
          </label>
          <label className="border rounded-lg p-3 block">
            <span className="text-sm text-gray-600">Upload ID Proof Photo</span>
            <input type="file" className="mt-2 block w-full" accept="image/*" onChange={(e) => setDocs((p) => ({ ...p, idProofImage: e.target.files?.[0] || null }))} required />
          </label>
          <label className="border rounded-lg p-3 block">
            <span className="text-sm text-gray-600">Upload Bike Photos (optional)</span>
            <input type="file" multiple className="mt-2 block w-full" accept="image/*" onChange={(e) => setDocs((p) => ({ ...p, bikeImages: [...(e.target.files || [])] }))} />
          </label>
        </div>

        <button disabled={loading} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold">
          {loading ? "Submitting..." : "Submit Rider Application"}
        </button>
      </form>
    </div>
  );
}
