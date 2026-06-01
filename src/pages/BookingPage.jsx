import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../api.js";
import PenguinLoader from "../components/PenguinLoader.jsx";
import { loadScript } from "../utils/loadScript";
import { getAbVariant } from "../utils/abTest";

const MAX_UI_GUESTS = 14;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "918248579662";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [serviceStartPoint, setServiceStartPoint] = useState("");
  const [serviceDestination, setServiceDestination] = useState("");
  const [serviceDays, setServiceDays] = useState(1);
  const [people, setPeople] = useState(1);
  const [idProof, setIdProof] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("property");
  const [loading, setLoading] = useState(false);
  const bookingFormRef = useRef(null);
  const ctaVariant = getAbVariant("sticky_cta_booking_page");

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
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/packages/${id}`);
        setTrip(res.data);
        const blockedRes = await api.get(`/api/bookings/package/${id}/blocked-dates`);
        setBlockedDates(blockedRes.data?.blockedDates || []);
      } catch (err) {
        if (err?.response?.status === 410) {
          alert("This package date is over. Please choose another available package.");
          navigate("/packages");
          return;
        }
        console.log(err);
      }
    };
    load();
  }, [id]);

  const blockedDateSet = new Set(blockedDates);
  const isBlockedDate = (date) => {
    const key = new Date(date).toISOString().split("T")[0];
    return blockedDateSet.has(key);
  };

  const packageDateOptions = (() => {
    if (!trip) return [];
    const raw = [trip.startDate, ...(trip.availableDates || [])].filter(Boolean);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return raw
      .map((value) => new Date(value))
      .filter((value) => !Number.isNaN(value.getTime()))
      .filter((value) => {
        const day = new Date(value);
        day.setHours(0, 0, 0, 0);
        return day >= today;
      });
  })();

  const configuredMaxGroup =
    Number(trip?.maxGroupSize) > 0 ? Number(trip.maxGroupSize) : MAX_UI_GUESTS;
  const maxAllowedGuests = Math.min(MAX_UI_GUESTS, configuredMaxGroup);
  const guestOptions = Array.from({ length: maxAllowedGuests }, (_, index) => index + 1);
  const isGuestCountInvalid = people < 1 || people > maxAllowedGuests;

  const submitBooking = async (e) => {
    e.preventDefault();
    const isPillionService = trip?.serviceType === "bike";

    if (isGuestCountInvalid) {
      return alert(`Please select between 1 and ${maxAllowedGuests} guests.`);
    }

    if (!checkIn || !checkOut) {
      return alert("Select check-in & check-out dates");
    }

    if (isPillionService && (!serviceStartPoint || !serviceDestination || !serviceDays)) {
      return alert("Add start point, destination, and number of days");
    }

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
      formData.append("serviceStartPoint", serviceStartPoint);
      formData.append("serviceDestination", serviceDestination);
      formData.append("serviceDays", serviceDays);
      formData.append("people", people);
      formData.append("paymentMethod", paymentMethod);

      if (idProof) formData.append("idProof", idProof);

      const bookingRes = await api.post("/api/bookings", formData);
      const booking = bookingRes.data.booking;

      if (paymentMethod === "property") {
        alert("Booking created! Pay at property.");
        navigate("/my-bookings");
        return;
      }

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

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      new window.Razorpay(options).open();
    } catch (err) {
      console.log("BOOKING ERROR:", err);
      alert("Booking failed");
    }

    setLoading(false);
  };

  if (!trip) return <PenguinLoader message="Loading booking details..." className="py-10" />;

  const isPillionService = trip.serviceType === "bike";
  const totalPrice = trip.price * people;
  const openWhatsapp = () => {
    const msg = `Hi Trippolama, I need help booking ${trip.title}.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold">{trip.title}</h1>
      <p className="text-gray-600 mt-2">Rated and trusted destination</p>

      <div className="grid grid-cols-4 gap-2 mt-6 rounded-2xl overflow-hidden">
        <img
          src={trip.images?.[0]}
          loading="eager"
          decoding="async"
          className="col-span-2 row-span-2 h-[420px] object-cover rounded-xl"
        />
        <img src={trip.images?.[1]} loading="lazy" decoding="async" className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[2]} loading="lazy" decoding="async" className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[3]} loading="lazy" decoding="async" className="h-52 object-cover rounded-xl" />
        <img src={trip.images?.[4]} loading="lazy" decoding="async" className="h-52 object-cover rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">About this trip</h2>
          <p className="text-gray-700">{trip.description}</p>
        </div>

        <form ref={bookingFormRef} onSubmit={submitBooking} className="border rounded-2xl p-6 shadow-xl space-y-4 sticky top-24">
          <p className="text-2xl font-bold">
            Rs.{trip.price} <span className="text-sm text-gray-500">/ person</span>
          </p>

          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-3 rounded-lg w-full"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {isPillionService && (
            <>
              <input
                className="border p-3 rounded-lg w-full"
                placeholder="Start Point"
                value={serviceStartPoint}
                onChange={(e) => setServiceStartPoint(e.target.value)}
              />
              <input
                className="border p-3 rounded-lg w-full"
                placeholder="Destination"
                value={serviceDestination}
                onChange={(e) => setServiceDestination(e.target.value)}
              />
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">{isPillionService ? "Trip Start Date" : "Check-in"}</label>
              <DatePicker
                selected={checkIn}
                onChange={(d) => {
                  setCheckIn(d);
                  if (isPillionService && d) {
                    const end = new Date(d);
                    end.setDate(end.getDate() + Number(serviceDays || 1) - 1);
                    setCheckOut(end);
                  } else {
                    setCheckOut(null);
                  }
                }}
                className="border p-3 rounded-lg w-full"
                minDate={new Date()}
                filterDate={(date) => !isBlockedDate(date)}
                includeDates={!isPillionService && packageDateOptions.length ? packageDateOptions : undefined}
              />
            </div>

            <div>
              <label className="font-medium">{isPillionService ? "Number of Days" : "Check-out"}</label>
              {isPillionService ? (
                <input
                  type="number"
                  min="1"
                  className="border p-3 rounded-lg w-full"
                  value={serviceDays}
                  onChange={(e) => {
                    const days = Number(e.target.value || 1);
                    setServiceDays(days);
                    if (checkIn) {
                      const end = new Date(checkIn);
                      end.setDate(end.getDate() + days - 1);
                      setCheckOut(end);
                    }
                  }}
                />
              ) : (
                <DatePicker
                  selected={checkOut}
                  onChange={setCheckOut}
                  className="border p-3 rounded-lg w-full"
                  minDate={checkIn || new Date()}
                  filterDate={(date) => !isBlockedDate(date)}
                />
              )}
            </div>
          </div>
          {blockedDates.length ? (
            <p className="text-xs font-medium text-red-600">
              Some dates are blocked/booked and cannot be selected.
            </p>
          ) : null}

          <select className="border p-3 rounded-lg w-full" value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {guestOptions.map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">Allowed guests: 1 to {maxAllowedGuests}</p>
          {isGuestCountInvalid ? (
            <p className="text-xs font-semibold text-red-600">Guest count must be between 1 and {maxAllowedGuests}.</p>
          ) : null}

          <div className="border rounded-lg p-3">
            <label>ID Proof (optional)</label>
            <input
              type="file"
              className="mt-2"
              accept="image/*,.pdf"
              onChange={(e) => setIdProof(e.target.files[0])}
            />
          </div>

          <div className="border rounded-lg p-3 space-y-2">
            <label className="font-semibold">Payment Method</label>

            <label className="flex gap-2 items-center">
              <input type="radio" checked={paymentMethod === "property"} onChange={() => setPaymentMethod("property")} />
              Pay at Property
            </label>

            <label className="flex gap-2 items-center">
              <input type="radio" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
              Pay Online (Razorpay)
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="mb-1 text-xs font-medium text-gray-500">Pricing Summary</p>
            <p className="flex justify-between text-gray-700">
              <span>
                Rs.{trip.price} × {people} {people === 1 ? "guest" : "guests"}
              </span>
              <span>Rs.{totalPrice}</span>
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Cancellation is allowed before check-in date. Refund for online payments is processed in 5-7 working days.
          </div>

          <button
            disabled={loading || isGuestCountInvalid}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white w-full p-3 rounded-lg font-bold"
          >
            {loading ? "Processing..." : `Pay Rs.${totalPrice} & Book`}
          </button>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-3 shadow-lg md:hidden">
        <div className="flex gap-2">
          {ctaVariant === "A" ? (
            <>
              <button
                type="button"
                onClick={() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="w-1/2 rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white"
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={openWhatsapp}
                className="w-1/2 rounded-lg border border-emerald-300 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700"
              >
                WhatsApp Help
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openWhatsapp}
                className="w-1/2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white"
              >
                WhatsApp Fast Help
              </button>
              <button
                type="button"
                onClick={() => bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="w-1/2 rounded-lg border border-purple-300 bg-purple-50 py-2 text-sm font-semibold text-purple-700"
              >
                Continue Booking
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
