import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function HostBookingForm({ listing }) {
  const user = JSON.parse(localStorage.getItem("wtc_user"));
  const userId = user?._id || user?.id; // FIXED

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // online | pay_at_property
  const [idProof, setIdProof] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------------------------
        VALIDATION
  --------------------------- */
  const validate = () => {
    if (!form.name || !form.email || !form.phone)
      return "Please fill all contact details.";

    if (!form.checkIn || !form.checkOut)
      return "Select check-in and check-out dates.";

    if (new Date(form.checkOut) <= new Date(form.checkIn))
      return "Check-out must be after Check-in.";

    if (!userId) return "Please login to continue.";

    return null;
  };

  /* ---------------------------
     UPLOAD ID PROOF
  --------------------------- */
  const uploadIdProof = async () => {
    if (!idProof) return null;

    const data = new FormData();
    data.append("file", idProof);

    const res = await axios.post(`${API}/api/host/bookings/upload-id`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  /* ---------------------------
      MAIN SUBMIT HANDLER
  --------------------------- */
  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    setLoading(true);

    try {
      const idProofUrl = await uploadIdProof();

      /* 1️⃣ CREATE BOOKING */
      const bookingPayload = {
        ...form,
        listingId: listing._id,
        hostId: listing.hostId?._id,
        amount: listing.price,
        userId,
        idProofUrl,
        paymentMode: paymentMethod,
        paymentStatus: paymentMethod === "online" ? "pending" : "unpaid",
      };

      const bookingRes = await axios.post(
        `${API}/api/host/bookings`,
        bookingPayload
      );

      const booking = bookingRes.data.booking;

      /* 2️⃣ PAY AT PROPERTY — NO PAYMENT */
      if (paymentMethod === "pay_at_property") {
        alert("Booking Confirmed! Please pay at the property.");
        setLoading(false);
        return;
      }

      /* 3️⃣ ONLINE PAYMENT (RAZORPAY) */
      const orderRes = await axios.post(
        `${API}/api/host/payments/create-order`,
        {
          amount: listing.price,
          receipt: booking._id,
        }
      );

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "WrongTurn Club",
        description: listing.title,
        order_id: order.id,

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        handler: async function (response) {
          await axios.post(`${API}/api/host/payments/verify`, {
            bookingId: booking._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment Successful 🎉 Booking Confirmed!");
        },

        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log("BOOKING ERROR:", err);
      alert("Booking failed");
    }

    setLoading(false);
  };

  /* ---------------------------
            UI SECTION
  --------------------------- */
  return (
    <div className="mt-8 p-6 border rounded-2xl shadow-lg bg-white space-y-5 max-w-lg">

      <h2 className="text-2xl font-bold">Book Your Stay</h2>

      {/* Contact Info */}
      <div className="space-y-2">
        <label className="font-medium">Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      {/* Dates */}
      <div className="space-y-2">
        <label className="font-medium">Check-In</label>
        <input
          type="date"
          name="checkIn"
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">Check-Out</label>
        <input
          type="date"
          name="checkOut"
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <label className="font-medium">Guests</label>
        <input
          type="number"
          name="guests"
          min="1"
          value={form.guests}
          onChange={handleChange}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      {/* ID Proof */}
      <div className="space-y-2">
        <label className="font-medium">ID Proof (Aadhaar / License)</label>
        <input
          type="file"
          onChange={(e) => setIdProof(e.target.files[0])}
          className="border rounded-xl p-3 w-full"
        />
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="font-medium">Payment Method</label>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            Online Payment
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "pay_at_property"}
              onChange={() => setPaymentMethod("pay_at_property")}
            />
            Pay at Property
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-emerald-600 text-white w-full py-3 rounded-xl text-lg font-semibold"
      >
        {loading
          ? "Processing..."
          : paymentMethod === "online"
          ? "Pay & Confirm"
          : "Confirm Booking"}
      </button>
    </div>
  );
}
