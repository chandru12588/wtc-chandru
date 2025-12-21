// frontend/src/components/BookingForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingForm({ pkg }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("wtc_user"));

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    checkIn: "",
    checkOut: "",
    people: 1,
    paymentMethod: "property",
  });

  const [idProof, setIdProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------------------------------------
      1️⃣ CREATE BOOKING WITH PAYMENT METHOD
  --------------------------------------------- */
  const createBooking = async () => {
    const fd = new FormData();

    fd.append("userId", user.id);
    fd.append("packageId", pkg._id);
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("checkIn", form.checkIn);
    fd.append("checkOut", form.checkOut);
    fd.append("people", form.people);
    fd.append("paymentMethod", form.paymentMethod);

    if (idProof) fd.append("idProof", idProof);

    const res = await axios.post(`${API}/api/bookings`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.booking;
  };

  /* ---------------------------------------------
      2️⃣ RAZORPAY PAYMENT HANDLER
  --------------------------------------------- */
  const startRazorpayPayment = async (booking) => {
    const amount = pkg.price * form.people;

    const orderRes = await axios.post(`${API}/api/payments/create-order`, {
      amount,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: orderRes.data.amount,
      currency: "INR",
      name: pkg.title,
      description: "Trip Booking",
      order_id: orderRes.data.id,

      handler: async (response) => {
        await axios.post(`${API}/api/payments/verify`, {
          bookingId: booking._id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        alert("🎉 Payment Successful!");
        navigate("/my-bookings");
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#6d28d9" },
    };

    new window.Razorpay(options).open();
  };

  /* ---------------------------------------------
      3️⃣ HANDLE FORM SUBMISSION
  --------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return navigate("/login");

    if (!form.name || !form.email || !form.phone || !form.checkIn || !form.checkOut) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      // Create Booking FIRST
      const booking = await createBooking();

      // Pay at Property
      if (form.paymentMethod === "property") {
        alert("Booking Confirmed — Pay at property.");
        return navigate("/my-bookings");
      }

      // Razorpay Online Payment
      await startRazorpayPayment(booking);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      alert("Booking failed. Check console.");
    }
    setLoading(false);
  };

  /* ---------------------------------------------
      UI FORM
  --------------------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Book This Trip</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Your Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Your Email"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Phone Number"
      />

      {/* CHECK-IN / CHECK-OUT */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          name="checkIn"
          required
          value={form.checkIn}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="checkOut"
          required
          value={form.checkOut}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* GUESTS */}
      <select
        name="people"
        value={form.people}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="1">1 Guest</option>
        <option value="2">2 Guests</option>
        <option value="3">3 Guests</option>
        <option value="4">4 Guests</option>
        <option value="5">5 Guests</option>
      </select>

      {/* ID PROOF */}
      <div className="border p-3 rounded">
        <label className="font-medium text-sm">Upload ID Proof</label>
        <input type="file" onChange={(e) => setIdProof(e.target.files[0])} className="mt-1" />
      </div>

      {/* PAYMENT METHOD */}
      <div className="border p-3 rounded space-y-2">
        <label className="font-semibold">Payment Method</label>

        <label className="flex gap-2 items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="property"
            checked={form.paymentMethod === "property"}
            onChange={handleChange}
          />
          Pay at Property
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={form.paymentMethod === "online"}
            onChange={handleChange}
          />
          Pay Online (Razorpay)
        </label>
      </div>

      {/* TOTAL PRICE */}
      <div className="bg-gray-100 p-3 rounded">
        <p className="flex justify-between text-sm">
          <span>₹{pkg.price} × {form.people} Guests</span>
          <strong>₹{pkg.price * form.people}</strong>
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold"
      >
        {loading
          ? "Processing..."
          : form.paymentMethod === "property"
          ? "Confirm Booking"
          : `Pay ₹${pkg.price * form.people} & Book`}
      </button>
    </form>
  );
}
