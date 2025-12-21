import React, { useState } from "react";
import axios from "axios";
import { saveHost } from "../utils/hostAuth";

export default function HostLogin() {
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/host/auth/login`, form);

      saveHost(res.data.host, res.data.token);

      window.location.href = "/host/dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Host Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
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
          Login
        </button>
      </form>
    </div>
  );
}
