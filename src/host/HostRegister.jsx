import React, { useState } from "react";
import axios from "axios";
import { SERVICE_COUNTRIES } from "../constants/countries";
import { saveHost } from "../utils/hostAuth";

export default function HostRegister() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    idProofType: "",
    idProof: "",
    googleMapLocation: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIdProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        idProof: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/host/auth/register`, form);

      alert("Registered successfully!");
      saveHost(res.data.host, res.data.token);
      window.location.href = "/host/dashboard";
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-xl rounded-xl border p-6 shadow-md">
      <h1 className="mb-2 text-xl font-bold">Become a Host</h1>
      <p className="mb-5 text-sm text-gray-600">
        Add your ID proof and Google Maps location to complete host onboarding.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email ID"
          type="email"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="whatsappNumber"
          placeholder="WhatsApp Number"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <select
          name="country"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Country</option>
          {SERVICE_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            name="state"
            placeholder="State"
            className="w-full rounded border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            className="w-full rounded border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="zipcode"
            placeholder="Zipcode"
            className="w-full rounded border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <select
          name="idProofType"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        >
          <option value="">Choose ID Proof Type</option>
          <option value="Aadhaar">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="Voter ID">Voter ID</option>
          <option value="Passport">Passport</option>
        </select>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload ID Proof
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="w-full rounded border p-2"
            onChange={handleIdProofUpload}
            required
          />
          {form.idProof && (
            <p className="text-xs text-emerald-700">ID proof selected</p>
          )}
        </div>

        <input
          name="googleMapLocation"
          placeholder="Google Maps Location Link"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full rounded border p-2"
          onChange={handleChange}
          required
        />

        <button className="w-full rounded bg-emerald-600 p-2 text-white">
          Register
        </button>
      </form>
    </div>
  );
}
