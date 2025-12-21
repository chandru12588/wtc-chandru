import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = enter email, 2 = OTP
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ MUST come from ENV (no localhost fallback)
  const API = import.meta.env.VITE_API_URL;

  if (!API) {
    console.error("❌ VITE_API_URL is missing");
  }

  /** Handle text input change */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">
          Login to WrongTurn Club
        </h2>

        {message && (
          <p className="text-center text-sm text-red-600 mb-3">{message}</p>
        )}

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
      </div>
    </div>
  );
}
