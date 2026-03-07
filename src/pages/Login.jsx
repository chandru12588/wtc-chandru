import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import bgImage from "../assets/bg4.avif";

export default function Login() {

const navigate = useNavigate();
const API = import.meta.env.VITE_API_URL;

const [mode,setMode] = useState("password"); 
// password | otp | reset

const [form,setForm] = useState({
email:"",
password:""
});

const [otp,setOtp] = useState("");
const [otpSent,setOtpSent] = useState(false);
const [showPassword,setShowPassword] = useState(false);
const [message,setMessage] = useState("");
const [loading,setLoading] = useState(false);

useEffect(()=>{

const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if(token){

localStorage.setItem("wtc_token",token);

fetch(`${API}/api/auth/me`,{
headers:{Authorization:`Bearer ${token}`}
})
.then(res=>res.json())
.then(data=>{
if(data.user){
localStorage.setItem("wtc_user",JSON.stringify(data.user));
navigate("/");
}
});

}

},[]);

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};




/* PASSWORD LOGIN */

const loginPassword = async()=>{

try{

setLoading(true);

const res = await fetch(`${API}/api/auth/login`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(form)
});

const data = await res.json();

if(!res.ok) throw new Error(data.message);

localStorage.setItem("wtc_token",data.token);
localStorage.setItem("wtc_user",JSON.stringify(data.user));

navigate("/");

}catch(err){

setMessage(err.message);

}

setLoading(false);

};



/* SEND OTP */

const sendOtp = async()=>{

try{

const res = await fetch(`${API}/api/auth/send-otp`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({email:form.email})
});

const data = await res.json();

if(!res.ok) throw new Error(data.message);

setOtpSent(true);
setMessage("OTP sent to your email");

}catch(err){

setMessage(err.message);

}

};



/* VERIFY OTP LOGIN */

const verifyOtp = async()=>{

try{

const res = await fetch(`${API}/api/auth/verify-otp-login`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
email:form.email,
otp:otp
})
});

const data = await res.json();

if(!res.ok) throw new Error(data.message);

localStorage.setItem("wtc_token",data.token);
localStorage.setItem("wtc_user",JSON.stringify(data.user));

navigate("/");

}catch(err){

setMessage(err.message);

}

};



/* RESET PASSWORD */

const resetPassword = async()=>{

try{

const res = await fetch(`${API}/api/auth/reset-password`,{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
email:form.email,
otp:otp,
password:form.password
})
});

const data = await res.json();

if(!res.ok) throw new Error(data.message);

setMessage("Password reset successful");
setMode("password");

}catch(err){

setMessage(err.message);

}

};



return(

<div className="relative min-h-screen flex items-center justify-center">

<div
className="fixed inset-0 bg-cover bg-center -z-10"
style={{backgroundImage:`url(${bgImage})`}}
></div>

<div className="fixed inset-0 bg-black/40 -z-10"></div>

<div className="w-full max-w-md px-6">

<div className="bg-white rounded-2xl shadow-2xl p-8">

<h1 className="text-3xl font-bold text-center mb-1">
WrongTurn
</h1>

<p className="text-center text-gray-500 text-sm mb-6">
Your Adventure Hub
</p>


{message && (
<div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
{message}
</div>
)}


<input
type="email"
name="email"
placeholder="Email"
onChange={handleChange}
className="w-full border px-4 py-3 rounded-lg mb-3"
/>


{/* PASSWORD MODE */}

{mode==="password" && (

<div className="relative mb-3">

<input
type={showPassword?"text":"password"}
name="password"
placeholder="Password"
onChange={handleChange}
className="w-full border px-4 py-3 rounded-lg pr-10"
/>

<button
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3 cursor-pointer"
>
{showPassword?<FaEyeSlash/>:<FaEye/>}
</button>

</div>

)}


{/* OTP INPUT */}

{(mode==="otp" || mode==="reset") && otpSent && (

<input
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
className="w-full border px-4 py-3 rounded-lg mb-3"
/>

)}


{/* RESET PASSWORD FIELD */}

{mode==="reset" && (

<input
type="password"
name="password"
placeholder="New Password"
onChange={handleChange}
className="w-full border px-4 py-3 rounded-lg mb-3"
/>

)}



{/* BUTTONS */}

{mode==="password" && (

<button
onClick={loginPassword}
className="w-full bg-rose-500 text-white py-3 rounded-lg font-bold cursor-pointer"
>

{loading ? "Please wait..." : "Login"}

</button>

)}


{mode==="otp" && !otpSent && (

<button
onClick={sendOtp}
className="w-full bg-blue-500 text-white py-3 rounded-lg cursor-pointer"
>
Send OTP
</button>

)}


{mode==="otp" && otpSent && (

<button
onClick={verifyOtp}
className="w-full bg-green-500 text-white py-3 rounded-lg cursor-pointer"
>
Verify OTP Login
</button>

)}


{mode==="reset" && otpSent && (

<button
onClick={resetPassword}
className="w-full bg-orange-500 text-white py-3 rounded-lg cursor-pointer"
>
Reset Password
</button>

)}



{/* LINKS */}

<div className="flex justify-between text-sm mt-4">

<button
onClick={()=>setMode("otp")}
className="text-blue-500 cursor-pointer"
>
Login with OTP
</button>

<button
onClick={()=>{
setMode("reset");
sendOtp();
}}
className="text-blue-500 cursor-pointer"
>
Forgot Password
</button>

</div>


{/* SOCIAL LOGIN */}

<div className="flex gap-3 mt-6">

<button
onClick={()=>window.location.href=`${API}/auth/google`}
className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
>

<FcGoogle size={20}/> Google

</button>

<button
onClick={()=>alert("Apple login coming soon")}
className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
>

<SiApple size={20}/> Apple

</button>

</div>


</div>

</div>

</div>

);

}