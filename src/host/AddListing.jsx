import React, { useState } from "react";
import axios from "axios";
import { getHostToken, getHostUser } from "../utils/hostAuth";

export default function AddListing() {
  const API = import.meta.env.VITE_API_URL;
  const host = getHostUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    category: "",
    startDate: "",   // ✅ NEW
    endDate: "",     // ✅ NEW
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!host?._id) {
      alert("Host not logged in. Please login again.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Please select trip start and end dates");
      return;
    }

    try {
      await axios.post(
        `${API}/api/host/listings`,
        {
          ...form,
          images,
          hostId: host._id,
          isHostListing: true, // ✅ IMPORTANT FLAG
        },
        {
          headers: { Authorization: getHostToken() },
        }
      );

      alert("Listing submitted for approval");
      window.location.href = "/host/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error submitting listing");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Title"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location (e.g., Ooty)"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />

        {/* ✅ NEW DATE FIELDS */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="startDate"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            className="border p-2 w-full"
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full h-20"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category (Camping / Trek / Stay)"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input type="file" multiple onChange={handleImage} />

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 w-full rounded">
          Submit Listing
        </button>
      </form>
    </div>
  );
}
