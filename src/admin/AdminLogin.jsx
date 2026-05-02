// frontend/src/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "../api.js";
import bgImage from "../assets/bg1.webp";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@trippolama.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/admin/auth/login", {
        email,
        password,
      });

      // ✅ FIXED TOKEN STORAGE
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      setSuccess("✓ Admin login successful");

      // redirect after login
      setTimeout(() => navigate("/admin"), 800);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-sm">
        <form
          onSubmit={submit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Trippolama
            </h1>
            <h2 className="text-xl font-semibold text-indigo-700 text-center mt-2">
              Admin Portal
            </h2>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@trippolama.com"
              className="w-full border-2 border-gray-200 focus:border-indigo-400 px-4 py-2.5 rounded-lg text-sm focus:outline-none bg-gray-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 focus:border-indigo-400 px-4 py-2.5 rounded-lg text-sm focus:outline-none bg-gray-50 focus:bg-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 p-1"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {/* Back */}
          <a
            href="/"
            className="block text-center text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-4"
          >
            ← Back to Home
          </a>
        </form>
      </div>
    </div>
  );
}
