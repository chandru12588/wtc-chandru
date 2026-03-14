// frontend/src/components/BookingForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { inferServiceType } from "../utils/serviceType";

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
    serviceStartPoint: "",
    serviceDestination: "",
    serviceDays: 1,
    bikeBrand: "",
    people: 1,
    paymentMethod: "property",
  });

  const [idProof, setIdProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const isPillionService = inferServiceType(pkg) === "bike";

  const addDays = (dateString, dayCount) => {
    if (!dateString || !dayCount) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + Math.max(Number(dayCount), 1) - 1);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (isPillionService && (name === "checkIn" || name === "serviceDays")) {
        next.checkOut = addDays(
          name === "checkIn" ? value : next.checkIn,
          name === "serviceDays" ? value : next.serviceDays
        );
      }

      return next;
    });
  };

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
    fd.append("serviceStartPoint", form.serviceStartPoint);
    fd.append("serviceDestination", form.serviceDestination);
    fd.append("serviceDays", form.serviceDays);
    fd.append("people", form.people);
    fd.append("paymentMethod", form.paymentMethod);

    if (idProof) fd.append("idProof", idProof);

    const res = await axios.post(`${API}/api/bookings`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.booking;
  };

  const createPillionRequest = async () => {
    const payload = {
      userId: user._id || user.id,
      packageId: pkg._id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      startDate: form.checkIn,
      numberOfDays: form.serviceDays,
      startPoint: form.serviceStartPoint,
      destination: form.serviceDestination,
      bikeBrand: form.bikeBrand,
    };

    const res = await axios.post(`${API}/api/pillion-requests`, payload);
    return res.data.request;
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

    if (
      isPillionService &&
      (!form.serviceStartPoint ||
        !form.serviceDestination ||
        !form.serviceDays ||
        !form.bikeBrand)
    ) {
      alert("Please add start point, destination, bike brand, and number of days.");
      return;
    }

    setLoading(true);
    try {
      if (isPillionService) {
        await createPillionRequest();
        alert("Pillion rider request submitted. Admin will assign an available rider and confirm.");
        navigate("/my-bookings");
        return;
      }

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
      <h2 className="text-xl font-bold">
        {isPillionService ? "Request Pillion Rider Service" : "Book This Trip"}
      </h2>

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

      {isPillionService && (
        <>
          <input
            name="serviceStartPoint"
            value={form.serviceStartPoint}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            placeholder="Start Point"
          />

          <input
            name="serviceDestination"
            value={form.serviceDestination}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            placeholder="Destination"
          />

          <input
            name="bikeBrand"
            value={form.bikeBrand}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            placeholder="Preferred Bike Brand"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Trip Start Date
              </label>
              <input
                type="date"
                name="checkIn"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.checkIn}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                name="serviceDays"
                required
                value={form.serviceDays}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
        </>
      )}

      {!isPillionService && (
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
      )}

      {!isPillionService && (
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
      )}

      {!isPillionService && (
        <div className="border p-3 rounded">
          <label className="font-medium text-sm">Upload ID Proof</label>
          <input type="file" onChange={(e) => setIdProof(e.target.files[0])} className="mt-1" />
        </div>
      )}

      {!isPillionService && (
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
      )}

      {/* TOTAL PRICE */}
      {isPillionService ? (
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm font-medium text-gray-700">
            This is a service request. Admin will assign an available rider after review.
          </p>
          {form.checkIn && form.serviceDays ? (
            <p className="mt-2 text-xs text-gray-600">
              Start: {form.checkIn} | End: {form.checkOut || "Auto-calculated"} | {form.serviceDays} day(s)
            </p>
          ) : null}
        </div>
      ) : (
        <div className="bg-gray-100 p-3 rounded">
          <p className="flex justify-between text-sm">
            <span>₹{pkg.price} × {form.people} Guests</span>
            <strong>₹{pkg.price * form.people}</strong>
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold"
      >
        {loading
          ? "Processing..."
          : isPillionService
          ? "Submit Request"
          : form.paymentMethod === "property"
          ? "Confirm Booking"
          : `Pay ₹${pkg.price * form.people} & Book`}
      </button>
    </form>
  );
}
