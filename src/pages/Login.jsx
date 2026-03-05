import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("login"); // login, signup, forgot
  const [loginMethod, setLoginMethod] = useState("password"); // password, otp
  const [step, setStep] = useState(1); // For OTP flow
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // ✅ MUST come from ENV (no localhost fallback)
  const API = import.meta.env.VITE_API_URL;

  if (!API) {
    console.error("❌ VITE_API_URL is missing");
  }

  /** Handle text input change */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /** -------------------------

  /** -------------------------
   *  SIGNUP WITH PASSWORD
   ---------------------------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Save login data
      localStorage.setItem("wtc_token", data.token);
      localStorage.setItem("wtc_user", JSON.stringify(data.user));

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   *  LOGIN WITH PASSWORD
   ---------------------------- */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save login data
      localStorage.setItem("wtc_token", data.token);
      localStorage.setItem("wtc_user", JSON.stringify(data.user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   *  SEND OTP
   ---------------------------- */
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setMessage("OTP sent successfully!");
      setStep(2);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   *  VERIFY OTP
   ---------------------------- */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP invalid");

      // Save login data
      localStorage.setItem("wtc_token", data.token);
      localStorage.setItem("wtc_user", JSON.stringify(data.user));

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   *  FORGOT PASSWORD
   ---------------------------- */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email");

      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">
          {authMode === "signup" ? "Sign Up" : authMode === "forgot" ? "Reset Password" : "Login"} to WrongTurn Club
        </h2>

        {/* AUTH MODE TABS */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => { setAuthMode("login"); setStep(1); setMessage(""); }}
            className={`flex-1 py-2 text-sm font-medium ${authMode === "login" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setAuthMode("signup"); setStep(1); setMessage(""); }}
            className={`flex-1 py-2 text-sm font-medium ${authMode === "signup" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>

        {message && (
          <p className="text-center text-sm text-red-600 mb-3">{message}</p>
        )}

        {/* FORGOT PASSWORD MODE */}
        {authMode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleChange}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold mt-2"
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="w-full text-xs text-gray-500 mt-2 underline"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* LOGIN MODE */}
        {authMode === "login" && (
          <>
            {/* LOGIN METHOD TABS */}
            <div className="flex mb-4">
              <button
                onClick={() => { setLoginMethod("password"); setStep(1); setMessage(""); }}
                className={`flex-1 py-2 text-sm font-medium ${loginMethod === "password" ? "bg-emerald-100 text-emerald-700 rounded" : "text-gray-500"}`}
              >
                Password
              </button>
              <button
                onClick={() => { setLoginMethod("otp"); setStep(1); setMessage(""); }}
                className={`flex-1 py-2 text-sm font-medium ${loginMethod === "otp" ? "bg-emerald-100 text-emerald-700 rounded" : "text-gray-500"}`}
              >
                OTP
              </button>
            </div>

            {/* PASSWORD LOGIN */}
            {loginMethod === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 text-sm">
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border rounded-lg px-3 py-2"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full border rounded-lg px-3 py-2 pr-10"
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 active:scale-90 transition-all duration-150 cursor-pointer p-1 rounded hover:bg-gray-100"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold mt-2"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("forgot")}
                  className="w-full text-xs text-gray-500 mt-2 underline"
                >
                  Forgot Password?
                </button>
              </form>
            )}

            {/* OTP LOGIN */}
            {loginMethod === "otp" && (
              <>
                {/* STEP 1 → NAME + EMAIL + PHONE */}
                {step === 1 && (
                  <form onSubmit={sendOtp} className="space-y-4 text-sm">
                    <div>
                      <label className="block mb-1">Name</label>
                      <input
                        name="name"
                        className="w-full border rounded-lg px-3 py-2"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full border rounded-lg px-3 py-2"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Phone (optional)</label>
                      <input
                        name="phone"
                        className="w-full border rounded-lg px-3 py-2"
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold mt-2"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                )}

                {/* STEP 2 → OTP */}
                {step === 2 && (
                  <form onSubmit={verifyOtp} className="space-y-4 text-sm">
                    <p className="text-gray-700 text-center">
                      OTP has been sent to <strong>{form.email}</strong>
                    </p>

                    <div>
                      <label className="block mb-1">Enter OTP</label>
                      <input
                        className="w-full border rounded-lg px-3 py-2 tracking-widest"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold mt-2"
                    >
                      {loading ? "Verifying..." : "Verify & Login"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-xs text-gray-500 mt-2 underline"
                    >
                      Change Email
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}

        {/* SIGNUP MODE */}
        {authMode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1">Name</label>
              <input
                name="name"
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Phone (optional)</label>
              <input
                name="phone"
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 active:scale-90 transition-all duration-150 cursor-pointer p-1 rounded hover:bg-gray-100"
                >
                  {showSignupPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-600 text-white rounded-lg py-2 font-semibold mt-2"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="w-full text-xs text-gray-500 mt-2 underline"
            >
              Already have an account? Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
