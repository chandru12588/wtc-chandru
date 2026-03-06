import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import bgImage from "../assets/bg4.avif";

export default function Login() {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setMessage("");

    // Check for token in URL (from social login redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem("wtc_token", token);
      // Fetch user data
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          localStorage.setItem("wtc_user", JSON.stringify(data.user));
          navigate("/");
        }
      })
      .catch(err => console.error("Error fetching user:", err));
    }
  }, [navigate, API]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    const payload =
      authMode === "login"
        ? { email: form.email, password: form.password }
        : form;

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("wtc_token", data.token);
      localStorage.setItem("wtc_user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      ></div>

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/40 -z-10"></div>

      {/* Login Card */}
      <div className="w-full max-w-md px-6">

        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">WrongTurn</h1>
            <p className="text-gray-500 text-sm">
              Your Ultimate Adventure Hub
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold cursor-pointer ${
                authMode === "login"
                  ? "bg-white shadow text-rose-600"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold cursor-pointer ${
                authMode === "signup"
                  ? "bg-white shadow text-rose-600"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {message && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">

            {authMode === "signup" && (
              <>
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  className="w-full border px-4 py-3 rounded-lg"
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-bold cursor-pointer"
            >
              {loading
                ? "Please wait..."
                : authMode === "login"
                ? "Login"
                : "Create Account"}
            </button>

          </form>

          {/* Social Login */}
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => window.location.href = `${API}/auth/google`}
              className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <FcGoogle size={20} /> Google
            </button>

            <button 
              onClick={() => alert("Apple Sign In coming soon!")}
              className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <SiApple size={20} /> Apple
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}