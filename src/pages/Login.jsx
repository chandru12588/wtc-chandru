import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/bg12.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.4) blur(1px)'
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">WrongTurn</h1>
            <p className="text-gray-600 text-sm font-medium">Your Ultimate Adventure Hub</p>
          </div>

          {/* Auth Mode Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => { setAuthMode("login"); setStep(1); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                authMode === "login"
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setStep(1); setMessage(""); }}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                authMode === "signup"
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.includes("successful") || message.includes("successful")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          {/* ============= FORGOT PASSWORD MODE ============= */}
          {authMode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className="w-full text-rose-500 hover:text-rose-600 font-semibold text-sm"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* ============= LOGIN MODE ============= */}
          {authMode === "login" && (
            <>
              {/* Login Method Tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => { setLoginMethod("password"); setStep(1); setMessage(""); }}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    loginMethod === "password"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => { setLoginMethod("otp"); setStep(1); setMessage(""); }}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    loginMethod === "otp"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  OTP
                </button>
              </div>

              {/* PASSWORD LOGIN */}
              {loginMethod === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 pr-12"
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
                  >
                    {loading ? "Logging in..." : "Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode("forgot")}
                    className="w-full text-center text-rose-500 hover:text-rose-600 font-semibold text-sm"
                  >
                    Forgot Password?
                  </button>
                </form>
              )}

              {/* OTP LOGIN */}
              {loginMethod === "otp" && (
                <>
                  {step === 1 && (
                    <form onSubmit={sendOtp} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                          name="name"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (optional)</label>
                        <input
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                          onChange={handleChange}
                        />
                      </div>

                      <button
                        disabled={loading}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
                      >
                        {loading ? "Sending..." : "Send Code"}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={verifyOtp} className="space-y-5">
                      <p className="text-gray-700 text-center text-sm">
                        We sent a code to <br />
                        <strong>{form.email}</strong>
                      </p>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Code</label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent tracking-widest text-center text-2xl font-bold"
                          placeholder="000000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        disabled={loading}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
                      >
                        {loading ? "Verifying..." : "Verify & Continue"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full text-center text-rose-500 hover:text-rose-600 font-semibold text-sm"
                      >
                        ← Try Different Email
                      </button>
                    </form>
                  )}
                </>
              )}
            </>
          )}

          {/* ============= SIGNUP MODE ============= */}
          {authMode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (optional)</label>
                <input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 pr-12"
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showSignupPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-98"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FcGoogle size={20} />
                  Google
                </button>
                <button
                  type="button"
                  className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <SiApple size={20} />
                  Apple
                </button>
              </div>

              <p className="text-center text-xs text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-rose-500 hover:text-rose-600 font-semibold"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-300">
          <p>© 2026 WrongTurn Club - Adventure Awaits</p>
        </div>
      </div>
    </div>
  );
}
