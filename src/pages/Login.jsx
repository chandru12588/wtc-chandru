import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import bgImage from "../assets/bg4.avif";

export default function Login() {
const navigate = useNavigate();
const API = import.meta.env.VITE_API_URL;

const [mode, setMode] = useState("password");
// password | otp | signup | reset
const [signupMethod, setSignupMethod] = useState("otp");
// otp | password

const [form, setForm] = useState({
name: "",
dob: "",
phone: "",
email: "",
password: ""
});

const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("error");
const [loading, setLoading] = useState(false);

const setUserSession = (token, user) => {
localStorage.removeItem("adminToken");
localStorage.removeItem("admin");
localStorage.setItem("wtc_token", token);
localStorage.setItem("wtc_user", JSON.stringify(user));
};

  useEffect(() => {
const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const requestedMode = params.get("mode");

  if (requestedMode === "signup") {
  setMode("signup");
  }

if (token) {
localStorage.removeItem("adminToken");
localStorage.removeItem("admin");
localStorage.setItem("wtc_token", token);

fetch(`${API}/api/auth/me`, {
headers: { Authorization: `Bearer ${token}` }
})
.then((res) => res.json())
.then((data) => {
if (data.user) {
localStorage.setItem("wtc_user", JSON.stringify(data.user));
navigate("/");
}
});
}
}, []);

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const switchMode = (nextMode) => {
setMode(nextMode);
setOtp("");
setOtpSent(false);
setMessage("");
setLoading(false);
if (nextMode !== "signup") {
setSignupMethod("otp");
}
};

const showFeedback = (text, type = "error") => {
setMessage(text);
setMessageType(type);
};

const sendOtp = async (targetMode = mode) => {
if (!form.email) {
showFeedback("Email required");
return;
}

if (targetMode === "signup" && (!form.name || !form.dob || !form.phone)) {
showFeedback("Name, DOB, mobile number and email required");
return;
}

setLoading(true);
try {
const payload = { email: form.email };
if (targetMode === "signup") {
payload.name = form.name;
payload.dob = form.dob;
payload.phone = form.phone;
}

const res = await fetch(`${API}/api/auth/send-otp`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload)
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);

setOtpSent(true);
showFeedback("OTP sent to your email", "success");
} catch (err) {
showFeedback(err.message);
} finally {
setLoading(false);
}
};

const verifyOtp = async () => {
if (!form.email || !otp) {
showFeedback("Email and OTP required");
return;
}

setLoading(true);
try {
const res = await fetch(`${API}/api/auth/verify-otp`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email: form.email, otp })
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);

setUserSession(data.token, data.user);
navigate("/");
} catch (err) {
showFeedback(err.message);
} finally {
setLoading(false);
}
};

const loginPassword = async () => {
if (!form.email || !form.password) {
showFeedback("Email and password required");
return;
}

setLoading(true);
try {
const res = await fetch(`${API}/api/auth/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email: form.email, password: form.password })
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);

setUserSession(data.token, data.user);
navigate("/");
} catch (err) {
showFeedback(err.message);
} finally {
setLoading(false);
}
};

const signupPassword = async () => {
if (!form.name || !form.dob || !form.phone || !form.email || !form.password) {
showFeedback("Name, DOB, mobile number, email and password required");
return;
}

setLoading(true);
try {
const res = await fetch(`${API}/api/auth/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
name: form.name,
dob: form.dob,
email: form.email,
phone: form.phone,
password: form.password
})
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);

setUserSession(data.token, data.user);
navigate("/");
} catch (err) {
showFeedback(err.message);
} finally {
setLoading(false);
}
};

const resetPassword = async () => {
if (!form.email || !otp || !form.password) {
showFeedback("Email, OTP and new password required");
return;
}

setLoading(true);
try {
const res = await fetch(`${API}/api/auth/reset-password`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
email: form.email,
otp,
password: form.password
})
});
const data = await res.json();
if (!res.ok) throw new Error(data.message);

showFeedback("Password updated. Please login with password.", "success");
setOtp("");
setOtpSent(false);
setForm({ ...form, password: "" });
setMode("password");
} catch (err) {
showFeedback(err.message);
} finally {
setLoading(false);
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setMessage("");

if (mode === "password") {
await loginPassword();
return;
}

if (mode === "otp") {
if (!otpSent) await sendOtp("otp");
else await verifyOtp();
return;
}

if (mode === "signup") {
if (signupMethod === "password") {
await signupPassword();
} else {
if (!otpSent) await sendOtp("signup");
else await verifyOtp();
}
return;
}

if (mode === "reset") {
if (!otpSent) await sendOtp("reset");
else await resetPassword();
}
};

const submitLabel = () => {
if (mode === "password") return loading ? "Logging in..." : "Login with Password";
if (mode === "otp") return otpSent ? (loading ? "Verifying..." : "Verify OTP Login") : (loading ? "Sending OTP..." : "Send Login OTP");
if (mode === "signup" && signupMethod === "password") return loading ? "Creating Account..." : "Sign Up with Password";
if (mode === "signup" && signupMethod === "otp") return otpSent ? (loading ? "Verifying..." : "Verify & Create Account") : (loading ? "Sending OTP..." : "Sign Up with OTP");
if (mode === "reset") return otpSent ? (loading ? "Updating..." : "Reset Password") : (loading ? "Sending OTP..." : "Send Reset OTP");
return "Continue";
};

return (
<div className="relative min-h-screen flex items-center justify-center px-4 py-10">
<div
className="fixed inset-0 bg-cover bg-center -z-20"
style={{ backgroundImage: `url(${bgImage})` }}
></div>
<div className="fixed inset-0 bg-slate-900/55 -z-10"></div>

<div className="w-full max-w-lg">
<div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
<h1 className="text-5xl font-black text-center tracking-tight text-slate-900">
Trippolama
</h1>
<p className="text-center text-slate-500 mt-1 mb-6 text-lg">
Your Adventure Hub
</p>

<div className="grid grid-cols-3 gap-2 mb-5">
<button
type="button"
onClick={() => switchMode("password")}
className={`rounded-xl py-2 text-sm font-semibold transition cursor-pointer ${mode === "password" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Login
</button>
<button
type="button"
onClick={() => switchMode("signup")}
className={`rounded-xl py-2 text-sm font-semibold transition cursor-pointer ${mode === "signup" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Sign Up
</button>
<button
type="button"
onClick={() => switchMode("reset")}
className={`rounded-xl py-2 text-sm font-semibold transition cursor-pointer ${mode === "reset" ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Reset
</button>
</div>

{(mode === "password" || mode === "otp") && (
<div className="grid grid-cols-2 gap-2 mb-5">
<button
type="button"
onClick={() => switchMode("password")}
className={`rounded-lg py-2 text-sm font-medium transition cursor-pointer ${mode === "password" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Password
</button>
<button
type="button"
onClick={() => switchMode("otp")}
className={`rounded-lg py-2 text-sm font-medium transition cursor-pointer ${mode === "otp" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
OTP
</button>
</div>
)}

{mode === "signup" && (
<div className="grid grid-cols-2 gap-2 mb-5">
<button
type="button"
onClick={() => {
setSignupMethod("otp");
setOtp("");
setOtpSent(false);
setMessage("");
}}
className={`rounded-lg py-2 text-sm font-medium transition cursor-pointer ${signupMethod === "otp" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Sign Up with OTP
</button>
<button
type="button"
onClick={() => {
setSignupMethod("password");
setOtp("");
setOtpSent(false);
setMessage("");
}}
className={`rounded-lg py-2 text-sm font-medium transition cursor-pointer ${signupMethod === "password" ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
>
Sign Up with Password
</button>
</div>
)}

{message && (
<div className={`p-3 rounded-lg mb-4 text-sm ${messageType === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
{message}
</div>
)}

<form onSubmit={handleSubmit} className="space-y-3">
{mode === "signup" && (
<>
<input
type="text"
name="name"
placeholder="Full Name"
value={form.name}
onChange={handleChange}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3"
/>
<input
type="tel"
name="phone"
placeholder="Mobile Number"
value={form.phone}
onChange={handleChange}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3"
/>
<input
type="date"
name="dob"
value={form.dob}
onChange={handleChange}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3"
/>
</>
)}

<input
type="email"
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3"
/>

{(mode === "password" || (mode === "signup" && signupMethod === "password") || (mode === "reset" && otpSent)) && (
<div className="relative">
<input
type={showPassword ? "text" : "password"}
name="password"
placeholder={mode === "reset" ? "New Password" : "Password"}
value={form.password}
onChange={handleChange}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3 pr-12"
/>
<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer"
>
{showPassword ? <FaEyeSlash /> : <FaEye />}
</button>
</div>
)}

{(mode === "otp" || (mode === "signup" && signupMethod === "otp") || mode === "reset") && otpSent && (
<input
type="text"
placeholder="Enter OTP"
value={otp}
onChange={(e) => setOtp(e.target.value)}
className="w-full border border-slate-300 focus:border-slate-500 focus:outline-none rounded-xl px-4 py-3"
/>
)}

<button
type="submit"
disabled={loading}
className={`w-full text-white py-3 rounded-xl font-semibold transition ${mode === "reset" ? "bg-orange-500 hover:bg-orange-600" : mode === "signup" ? "bg-emerald-600 hover:bg-emerald-700" : mode === "otp" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"} ${loading ? "opacity-80 cursor-wait" : "cursor-pointer"}`}
>
{submitLabel()}
</button>
</form>

<div className="my-5 h-px bg-slate-200"></div>

<div className="grid grid-cols-2 gap-3">
<button
type="button"
onClick={() => (window.location.href = `${API}/api/auth/google`)}
className="border border-slate-300 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
>
<FcGoogle size={20} /> Google
</button>
<button
type="button"
onClick={() => showFeedback("Apple Sign-In is coming soon.", "success")}
className="border border-slate-300 py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
>
<SiApple size={20} /> Apple
</button>
</div>
</div>
</div>
</div>
);
}
