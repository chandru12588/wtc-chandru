import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { inferServiceType } from "../utils/serviceType";
import { SERVICE_COUNTRIES } from "../constants/countries";

const ID_PROOF_OPTIONS = ["Aadhaar", "PAN", "Passport", "Voter ID"];
const GUIDE_LANGUAGE_OPTIONS = [
  "English",
  "Tamil",
  "Hindi",
  "Malayalam",
  "Kannada",
  "Telugu",
  "French",
  "German",
  "Spanish",
  "Italian",
  "Portuguese",
  "Arabic",
  "Japanese",
  "Korean",
  "Mandarin",
  "Russian",
];

const SERVICE_COPY = {
  bike: {
    heading: "Book Pillion Ride",
    summary:
      "Submit your travel details and documents. Admin will review the request and assign a rider.",
    policyTitle: "Pillion Rider Policy",
    points: [
      "Petrol cost is managed by the customer or shared directly with the rider.",
      "Stay sharing for the rider must be arranged by the customer during the trip.",
      "The rider handles their own food. No other extra charges are applied.",
      "Tips are optional if you are satisfied with the safety and support provided.",
    ],
  },
  guide: {
    heading: "Book a Guide",
    summary:
      "Choose private or group support, share your travel details, and submit your documents for review.",
    policyTitle: "Guide Service Policy",
    points: [
      "Customer chooses the preferred guide language, service mode, and travel requirement while booking.",
      "The guide helps explore places, routes, and local travel support based on your request.",
      "Entry tickets, food, transport, and personal expenses are not included unless stated.",
      "Admin reviews the request, confirms availability, and shares the approved charge.",
    ],
  },
  driver: {
    heading: "Request Acting Driver",
    summary:
      "Share the vehicle details, route, and trip plan. Admin will review and assign a driver.",
    policyTitle: "Acting Driver Policy",
    points: [
      "Acting driver service is charged per day based on the package price.",
      "Customer must provide valid vehicle details and RC information.",
      "Fuel, tolls, parking, and trip expenses are handled by the customer.",
      "Driver assignment is done manually after admin review.",
    ],
  },
};

export default function BookingForm({ pkg, containerClassName = "" }) {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("wtc_user"));
  const serviceType = inferServiceType(pkg);
  const isServiceRequest = serviceType !== "general";
  const copy = SERVICE_COPY[serviceType];

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    age: "",
    checkIn: "",
    checkOut: "",
    serviceStartPoint: "",
    serviceDestination: "",
    serviceDays: 1,
    bikeBrand: "",
    people: 1,
    paymentMethod: "property",
    preferredLanguage: "",
    whatsappNumber: "",
    customerCountry: "",
    serviceCountry: "",
    serviceState: "",
    serviceCity: "",
    guideServiceMode: "private",
    idProofType: "",
    policyAccepted: false,
    vehicleModel: "",
    vehicleYear: "",
    fuelType: "petrol",
    vehicleRcNumber: "",
    tripType: "holiday",
    tripPlan: "",
  });

  const [idProof, setIdProof] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const renderUploadField = ({
    inputId,
    label,
    file,
    required = false,
    accept = "image/*,.pdf",
    onChange,
  }) => (
    <div className="min-w-0 rounded border p-3">
      <label className="block text-sm font-medium">{label}</label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        required={required}
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        className="mt-3 inline-flex cursor-pointer items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        Choose File
      </label>
      <p className="mt-2 truncate text-sm text-gray-600">
        {file?.name || "No file chosen"}
      </p>
    </div>
  );

  const addDays = (dateString, dayCount) => {
    if (!dateString || !dayCount) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + Math.max(Number(dayCount), 1) - 1);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const next = { ...prev, [name]: nextValue };

      if (name === "guideServiceMode" && value === "private") {
        next.people = 1;
      }

      if (name === "guideServiceMode" && value === "group" && Number(prev.people) < 2) {
        next.people = 2;
      }

      if (name === "serviceCountry" && value !== "India") {
        next.serviceState = "";
        next.serviceCity = "";
      }

      if (
        isServiceRequest &&
        (name === "checkIn" || name === "serviceDays")
      ) {
        next.checkOut = addDays(
          name === "checkIn" ? value : next.checkIn,
          name === "serviceDays" ? value : next.serviceDays
        );
      }

      return next;
    });
  };

  const createBooking = async () => {
    const fd = new FormData();

    fd.append("userId", user._id || user.id);
    fd.append("packageId", pkg._id);
    fd.append("serviceType", serviceType);
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("age", form.age);
    fd.append("checkIn", form.checkIn);
    fd.append("checkOut", form.checkOut);
    fd.append("serviceStartPoint", form.serviceStartPoint);
    fd.append("serviceDestination", form.serviceDestination);
    fd.append("serviceDays", form.serviceDays);
    fd.append("bikeBrand", form.bikeBrand);
    fd.append("people", form.people);
    fd.append("paymentMethod", form.paymentMethod);
    fd.append("preferredLanguage", form.preferredLanguage);
    fd.append("whatsappNumber", form.whatsappNumber);
    fd.append("customerCountry", form.customerCountry);
    fd.append("serviceCountry", form.serviceCountry);
    fd.append("serviceState", form.serviceState);
    fd.append("serviceCity", form.serviceCity);
    fd.append("guideServiceMode", form.guideServiceMode);
    fd.append("policyAccepted", form.policyAccepted);
    fd.append("idProofType", form.idProofType);
    fd.append("vehicleModel", form.vehicleModel);
    fd.append("vehicleYear", form.vehicleYear);
    fd.append("fuelType", form.fuelType);
    fd.append("vehicleRcNumber", form.vehicleRcNumber);
    fd.append("tripType", form.tripType);
    fd.append("tripPlan", form.tripPlan);

    if (idProof) fd.append("idProof", idProof);
    if (profilePhoto) fd.append("profilePhoto", profilePhoto);
    if (vehicleImage) fd.append("vehicleImage", vehicleImage);

    const res = await axios.post(`${API}/api/bookings`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.booking;
  };

  const createPillionRequest = async () => {
    const fd = new FormData();

    fd.append("userId", user._id || user.id);
    fd.append("packageId", pkg._id);
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("age", form.age);
    fd.append("startDate", form.checkIn);
    fd.append("numberOfDays", form.serviceDays);
    fd.append("startPoint", form.serviceStartPoint);
    fd.append("destination", form.serviceDestination);
    fd.append("bikeBrand", form.bikeBrand);
    fd.append("idProofType", form.idProofType);
    fd.append("policyAccepted", form.policyAccepted);

    if (idProof) fd.append("idProof", idProof);
    if (profilePhoto) fd.append("profilePhoto", profilePhoto);

    const res = await axios.post(`${API}/api/pillion-requests`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.request;
  };

  const startRazorpayPayment = async (booking) => {
    const amount = pkg.price * Number(form.people || 1);

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

        alert("Payment successful");
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

  const validateBaseFields = () => {
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill name, email, and phone.");
      return false;
    }

    if (!form.checkIn || !form.checkOut) {
      alert("Please select the service dates.");
      return false;
    }

    return true;
  };

  const validateServiceFields = () => {
    if (serviceType === "bike") {
      if (
        !form.age ||
        !form.serviceStartPoint ||
        !form.serviceDestination ||
        !form.serviceDays ||
        !form.bikeBrand ||
        !form.idProofType ||
        !idProof ||
        !profilePhoto ||
        !form.policyAccepted
      ) {
        alert("Please complete all rider request fields, uploads, and policy confirmation.");
        return false;
      }
    }

    if (serviceType === "guide") {
      if (
        !form.age ||
        !form.whatsappNumber ||
        !form.customerCountry ||
        !form.serviceCountry ||
        !form.serviceDestination ||
        !form.preferredLanguage ||
        !form.idProofType ||
        !idProof ||
        !form.serviceDays ||
        (form.serviceCountry === "India" && (!form.serviceState || !form.serviceCity)) ||
        (form.guideServiceMode === "group" &&
          (Number(form.people) < 2 || Number(form.people) > 7))
      ) {
        alert("Please complete all guide request fields, upload ID proof, and keep group size within 7 people.");
        return false;
      }
    }

    if (serviceType === "driver") {
      if (
        !form.age ||
        !form.serviceStartPoint ||
        !form.serviceDestination ||
        !form.serviceDays ||
        !form.vehicleModel ||
        !form.vehicleYear ||
        !form.fuelType ||
        !form.vehicleRcNumber ||
        !vehicleImage ||
        !idProof ||
        !form.idProofType ||
        !form.tripType
      ) {
        alert("Please complete all acting driver details, uploads, and trip information.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!validateBaseFields()) return;
    if (isServiceRequest && !validateServiceFields()) return;

    setLoading(true);
    try {
      if (serviceType === "bike") {
        await createPillionRequest();
        alert("Pillion rider request submitted. Admin will assign a rider after review.");
        navigate("/my-bookings");
        return;
      }

      const booking = await createBooking();

      if (serviceType === "guide" || serviceType === "driver") {
        alert("Service request submitted. Admin will review and confirm the assignment.");
        navigate("/my-bookings");
        return;
      }

      if (form.paymentMethod === "property") {
        alert("Booking confirmed. Pay at property.");
        navigate("/my-bookings");
        return;
      }

      await startRazorpayPayment(booking);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralFields = () => (
    <>
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
        <option value="6">6 Guests</option>
        <option value="7">7 Guests</option>
        <option value="8">8 Guests</option>
        <option value="9">9 Guests</option>
        <option value="10">10 Guests</option>
        <option value="11">11 Guests</option>
        <option value="12">12 Guests</option>
        <option value="13">13 Guests</option>
        <option value="14">14 Guests</option>
      </select>

      <div className="border p-3 rounded">
        <label className="font-medium text-sm">Upload ID Proof</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setIdProof(e.target.files?.[0] || null)}
          className="mt-1 block w-full min-w-0 text-sm"
        />
      </div>

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
          Pay Online
        </label>
      </div>
    </>
  );

  const renderServiceDateFields = () => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Start Date</label>
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
        <label className="mb-1 block text-sm font-medium">Number of Days</label>
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
  );

  const renderPillionFields = () => (
    <>
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        type="number"
        min="18"
        required
        className="border p-2 rounded w-full"
        placeholder="Your Age"
      />
      <input
        name="serviceStartPoint"
        value={form.serviceStartPoint}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Starting Point"
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
      {renderServiceDateFields()}
      <select
        name="idProofType"
        value={form.idProofType}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select ID Proof Type</option>
        {ID_PROOF_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="grid gap-3 md:grid-cols-2">
        {renderUploadField({
          inputId: "pillion-id-proof",
          label: "Upload ID Proof",
          file: idProof,
          required: true,
          accept: "image/*,.pdf",
          onChange: (e) => setIdProof(e.target.files?.[0] || null),
        })}
        {renderUploadField({
          inputId: "pillion-photo",
          label: "Upload Your Photo",
          file: profilePhoto,
          required: true,
          accept: "image/*",
          onChange: (e) => setProfilePhoto(e.target.files?.[0] || null),
        })}
      </div>
      <label className="flex items-start gap-2 rounded border p-3 text-sm text-gray-700">
        <input
          type="checkbox"
          name="policyAccepted"
          checked={form.policyAccepted}
          onChange={handleChange}
          className="mt-1"
        />
        <span>I understand the cost sharing and service policy for pillion rides.</span>
      </label>
    </>
  );

  const renderGuideFields = () => (
    <>
      <div className="rounded-xl bg-sky-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{pkg.guideType || "Guide Service"}</p>
        <p className="mt-1">Customer can choose private or group service while booking.</p>
        <p className="mt-1">Group guide requests allow a maximum of 7 people.</p>
      </div>

      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        type="number"
        min="18"
        required
        className="border p-2 rounded w-full"
        placeholder="Your Age"
      />
      <input
        name="whatsappNumber"
        value={form.whatsappNumber}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="WhatsApp Number"
      />
      <select
        name="guideServiceMode"
        value={form.guideServiceMode}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="private">Private Guide</option>
        <option value="group">Group Guide</option>
      </select>
      <input
        name="customerCountry"
        value={form.customerCountry}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Country You Are Coming From"
      />
      <select
        name="serviceCountry"
        value={form.serviceCountry}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Service Country</option>
        {SERVICE_COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {form.serviceCountry === "India" && (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="serviceState"
            value={form.serviceState}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            placeholder="State"
          />
          <input
            name="serviceCity"
            value={form.serviceCity}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
            placeholder="City"
          />
        </div>
      )}
      <select
        name="preferredLanguage"
        value={form.preferredLanguage}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Preferred Language</option>
        {GUIDE_LANGUAGE_OPTIONS.map((language) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
      {form.guideServiceMode === "group" ? (
        <select
          name="people"
          value={Number(form.people) < 2 ? 2 : form.people}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          {Array.from({ length: 6 }, (_, index) => index + 2).map((count) => (
            <option key={count} value={count}>
              {count} People
            </option>
          ))}
        </select>
      ) : (
        <div className="rounded border border-dashed p-3 text-sm text-gray-600">
          Private guide booking does not need a separate people-count selection.
        </div>
      )}
      <input
        name="serviceDestination"
        value={form.serviceDestination}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Preferred Location / Places to Explore"
      />
      {renderServiceDateFields()}
      <select
        name="idProofType"
        value={form.idProofType}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select ID Proof Type</option>
        {ID_PROOF_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {renderUploadField({
        inputId: "guide-id-proof",
        label: "Upload ID Proof",
        file: idProof,
        required: true,
        accept: "image/*,.pdf",
        onChange: (e) => setIdProof(e.target.files?.[0] || null),
      })}
    </>
  );

  const renderDriverFields = () => (
    <>
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        type="number"
        min="18"
        required
        className="border p-2 rounded w-full"
        placeholder="Your Age"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="vehicleModel"
          value={form.vehicleModel}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
          placeholder="Car Model"
        />
        <input
          name="vehicleYear"
          value={form.vehicleYear}
          onChange={handleChange}
          type="number"
          min="1990"
          max="2099"
          required
          className="border p-2 rounded w-full"
          placeholder="Model Year"
        />
      </div>
      <select
        name="fuelType"
        value={form.fuelType}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="petrol">Petrol</option>
        <option value="diesel">Diesel</option>
        <option value="cng">CNG</option>
      </select>
      <input
        name="vehicleRcNumber"
        value={form.vehicleRcNumber}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
        placeholder="Vehicle RC Number"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="serviceStartPoint"
          value={form.serviceStartPoint}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
          placeholder="Starting Point"
        />
        <input
          name="serviceDestination"
          value={form.serviceDestination}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
          placeholder="Destination"
        />
      </div>
      {renderServiceDateFields()}
      <select
        name="people"
        value={form.people}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="1">1 Person Travelling</option>
        <option value="2">2 People Travelling</option>
        <option value="3">3 People Travelling</option>
        <option value="4">4 People Travelling</option>
        <option value="5">5+ People Travelling</option>
      </select>
      <select
        name="tripType"
        value={form.tripType}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      >
        <option value="holiday">Holiday Trip</option>
        <option value="business">Business Trip</option>
        <option value="other">Other Trip</option>
      </select>
      <textarea
        name="tripPlan"
        value={form.tripPlan}
        onChange={handleChange}
        rows={3}
        className="border p-2 rounded w-full"
        placeholder="Trip Plan and Place Names"
      />
      <select
        name="idProofType"
        value={form.idProofType}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select ID Proof Type</option>
        {ID_PROOF_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="grid gap-3 md:grid-cols-2">
        {renderUploadField({
          inputId: "driver-id-proof",
          label: "Upload ID Proof",
          file: idProof,
          required: true,
          accept: "image/*,.pdf",
          onChange: (e) => setIdProof(e.target.files?.[0] || null),
        })}
        {renderUploadField({
          inputId: "driver-car-photo",
          label: "Upload Car Photo",
          file: vehicleImage,
          required: true,
          accept: "image/*",
          onChange: (e) => setVehicleImage(e.target.files?.[0] || null),
        })}
      </div>
    </>
  );

  const totalAmount =
    serviceType === "guide" || serviceType === "driver"
      ? pkg.price * Number(form.serviceDays || 1)
      : pkg.price * Number(form.people || 1);
  const isGuidePricePending = serviceType === "guide" && !Number(pkg.price);

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border p-5 shadow ${containerClassName}`}
    >
      <div className="space-y-4 md:flex md:h-full md:min-h-0 md:flex-col">
        <div className="space-y-4 md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-2">
          <h2 className="text-lg font-bold leading-tight">
            {copy?.heading || "Book This Trip"}
          </h2>

          {copy ? (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{copy.policyTitle}</p>
              <p className="mt-2">{copy.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {copy.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}

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
            type="email"
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

          {serviceType === "bike" && renderPillionFields()}
          {serviceType === "guide" && renderGuideFields()}
          {serviceType === "driver" && renderDriverFields()}
          {serviceType === "general" && renderGeneralFields()}

          {isServiceRequest ? (
            <div className="bg-gray-100 p-3 rounded text-sm text-gray-700">
              {isGuidePricePending ? (
                <>
                  <p className="font-medium">Guide price will be confirmed after admin approval.</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Submit the request first. Approved guide pricing will be updated later.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">
                    Estimated charge: Rs. {pkg.price} x {form.serviceDays} day(s)
                  </p>
                  <p className="mt-1">
                    Total estimate: <strong>Rs. {totalAmount}</strong>
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Request stays pending until admin reviews and assigns the service.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 p-3 rounded">
              <p className="flex justify-between text-sm">
                <span>Rs. {pkg.price} x {form.people} Guests</span>
                <strong>Rs. {totalAmount}</strong>
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-purple-600 py-2 font-semibold text-white md:mt-4"
        >
          {loading
            ? "Processing..."
            : serviceType === "general"
            ? form.paymentMethod === "property"
              ? "Confirm Booking"
              : `Pay Rs. ${totalAmount} & Book`
            : "Submit Service Request"}
        </button>
      </div>
    </form>
  );
}
