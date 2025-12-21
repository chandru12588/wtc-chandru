import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../api.js";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [people, setPeople] = useState(1);
  const [idProof, setIdProof] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("property");
  const [loading, setLoading] = useState(false);

  /* Load logged-in user */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wtc_user"));
    if (!stored) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    setUser(stored);
    setName(stored.name);
    setEmail(stored.email);
  }, []);

  /* Load package */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, [id]);

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut)
      return alert("Select check-in & check-out dates");

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("userId", user._id || user.id);
      formData.append("packageId", id);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("checkIn", checkIn.toISOString());
      formData.append("checkOut", checkOut.toISOString());
      formData.append("people", people);
      formData.append("paymentMethod", paymentMethod);

      if (idProof) formData.append("idProof", idProof);

      // 1️⃣ Create booking first
      const bookingRes = await api.post("/api/bookings", formData);
      const booking = bookingRes.data.booking;

      // 2️⃣ Pay at Property
      if (paymentMethod === "property") {
        alert("Booking created! Pay at property.");
        navigate("/my-bookings");
        return;
      }

      // 3️⃣ Online Payment → Razorpay
      const orderRes = await api.post("/api/payments/create-order", {
        amount: trip.price * people,
      });

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: trip.title,
        description: "Trip Booking",
        order_id: order.id,

        handler: async function (response) {
          await api.post("/api/payments/verify", {
            bookingId: booking._id,
            ...response,
          });

          alert("Payment Success!");
          navigate("/my-bookings");
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log("BOOKING ERROR:", err);
      alert("Booking failed");
    }

    setLoading(false);
  };

  if (!trip) return <p className="text-center py-10">Loading...</p>;

  const totalPrice = trip.price * people;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold">{trip.title}</h1>
      <p className="text-gray-600 mt-2">⭐ 4.9 · Beautiful Destination</p>

      {/* IMAGES */}
      <div className="grid grid-cols-4 gap-2 mt-6 rounded-2xl overflow-hidden">
        <img src={trip.images?.[0]} className="col-span-2 row-span-2 h-[420px] object-cover rounded-xl" />
        <img src={trip.images?.[1]} className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[2]} className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[3]} className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[4]} className="h-52 object-cover rounded-xl" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">

        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">About this trip</h2>
          <p className="text-gray-700">{trip.description}</p>
        </div>

        {/* RIGHT BOOKING FORM */}
        <form onSubmit={submitBooking} className="border rounded-2xl p-6 shadow-xl space-y-4 sticky top-24">

          <p className="text-2xl font-bold">
            ₹{trip.price} <span className="text-sm text-gray-500">/ person</span>
          </p>

          {/* Inputs */}
          <input className="border p-3 rounded-lg w-full" placeholder="Name"
            value={name} onChange={(e) => setName(e.target.value)} />

          <input className="border p-3 rounded-lg w-full" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />

          <input className="border p-3 rounded-lg w-full" placeholder="Phone"
            value={phone} onChange={(e) => setPhone(e.target.value)} />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Check-in</label>
              <DatePicker selected={checkIn} onChange={(d) => { setCheckIn(d); setCheckOut(null); }}
                className="border p-3 rounded-lg w-full" minDate={new Date()} />
            </div>

            <div>
              <label className="font-medium">Check-out</label>
              <DatePicker selected={checkOut} onChange={setCheckOut}
                className="border p-3 rounded-lg w-full" minDate={checkIn || new Date()} />
            </div>
          </div>

          {/* People */}
          <select className="border p-3 rounded-lg w-full"
            value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
          </select>

          {/* ID Proof */}
          <div className="border rounded-lg p-3">
            <label>ID Proof (optional)</label>
            <input type="file" className="mt-2"
              onChange={(e) => setIdProof(e.target.files[0])} />
          </div>

          {/* PAYMENT METHOD */}
          <div className="border rounded-lg p-3 space-y-2">

            <label className="font-semibold">Payment Method</label>

            <label className="flex gap-2 items-center">
              <input type="radio" checked={paymentMethod === "property"}
                onChange={() => setPaymentMethod("property")} />
              Pay at Property
            </label>

            <label className="flex gap-2 items-center">
              <input type="radio" checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")} />
              Pay Online (Razorpay)
            </label>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="flex justify-between text-gray-700">
              <span>₹{trip.price} × {people}</span>
              <span>₹{totalPrice}</span>
            </p>
          </div>

          {/* Button */}
          <button disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full p-3 rounded-lg font-bold">
            {loading ? "Processing..." : `Pay ₹${totalPrice} & Book`}
          </button>

        </form>
      </div>
    </div>
  );
}
