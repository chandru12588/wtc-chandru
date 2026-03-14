import React, { useState } from "react";
import axios from "axios";
import { SERVICE_COUNTRIES } from "../constants/countries";
import { GUEST_PLACE_TYPES } from "../constants/guestPlaceTypes";
import { HOST_STAY_TYPES } from "../constants/stayTypes";
import { getHostToken, getHostUser } from "../utils/hostAuth";

export default function AddListing() {
  const API = import.meta.env.VITE_API_URL;
  const host = getHostUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    whatsappNumber: "",
    location: "",
    price: "",
    stayType: "",
    guestPlaceType: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!host?._id) return alert("Host not logged in. Please login again.");
    if (!form.startDate || !form.endDate) {
      return alert("Select start & end dates");
    }

    try {
      await axios.post(
        `${API}/api/host/listings`,
        {
          ...form,
          images,
          hostId: host._id,
          isHostListing: true,
        },
        {
          headers: { Authorization: getHostToken() },
        }
      );

      alert("Listing submitted successfully! Awaiting approval");
      window.location.href = "/host/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error submitting listing");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Add New Stay Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Stay Title"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <select
          name="country"
          className="w-full border p-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Country</option>
          {SERVICE_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            name="state"
            placeholder="State"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="zipcode"
            placeholder="Zipcode"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="whatsappNumber"
          placeholder="WhatsApp Number for Customers"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price per Night"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <select
          name="stayType"
          onChange={handleChange}
          className="w-full border p-2"
          required
        >
          <option value="">Choose Stay Type</option>
          {HOST_STAY_TYPES.map((stayType) => (
            <option key={stayType} value={stayType}>
              {stayType}
            </option>
          ))}
        </select>

        <div className="space-y-2 rounded-lg border p-3">
          <p className="text-sm font-semibold">
            What type of place will guests have?
          </p>
          {GUEST_PLACE_TYPES.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer gap-3 rounded-md border p-3"
            >
              <input
                type="radio"
                name="guestPlaceType"
                value={option.value}
                checked={form.guestPlaceType === option.value}
                onChange={handleChange}
                required
              />
              <span>
                <span className="block font-medium">{option.label}</span>
                <span className="block text-sm text-gray-600">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <select
          name="category"
          className="w-full border p-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option>Stay</option>
          <option>Camping</option>
          <option>Experience</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="startDate"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Short Description"
          className="h-24 w-full border p-2"
          onChange={handleChange}
          required
        />

        <input type="file" multiple onChange={handleImage} />

        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-20 w-full rounded object-cover"
              />
            ))}
          </div>
        )}

        <button className="w-full rounded bg-emerald-600 p-2 font-semibold text-white hover:bg-emerald-700">
          Submit Listing
        </button>
      </form>
    </div>
  );
}
