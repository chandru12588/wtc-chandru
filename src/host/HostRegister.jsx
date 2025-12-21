import React, { useState } from "react";
import axios from "axios";
import { saveHost } from "../utils/hostAuth";

export default function HostRegister() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/host/auth/register`, form);

      alert("Registered successfully!");
      saveHost(res.data.host, res.data.token);

      window.location.href = "/host/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Become a Host</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          className="border p-2 w-full rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          className="border p-2 w-full rounded"
          onChange={handleChange}
        />

        <button className="bg-emerald-600 w-full p-2 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
}
