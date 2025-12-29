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
    stayType: "",       // ⭐ New
    category: "",
    startDate: "",
    endDate: "",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

    if (!form.startDate || !form.endDate)
      return alert("Please select start & end dates");

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

      alert("Listing submitted for approval!");
      window.location.href = "/host/dashboard";

    } catch (err) {
      console.error(err);
      alert("Error submitting listing");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Stay Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input name="title" placeholder="Stay Title"
          className="border p-2 w-full" onChange={handleChange} required />

        <input name="location" placeholder="Location (Ooty / Munnar / Coorg)"
          className="border p-2 w-full" onChange={handleChange} required />

        <input name="price" type="number" placeholder="Price per Night"
          className="border p-2 w-full" onChange={handleChange} required />


        {/* ⭐ Stay Type Selection */}
        <select name="stayType" onChange={handleChange}
          className="border p-2 w-full" required>
          <option value="">Choose Stay Type</option>
          <option>Treehouse</option>
          <option>Bamboo House</option>
          <option>Glamping Tent</option>
          <option>Dome Stay</option>
          <option>Cabin</option>
          <option>Wooden Cottage</option>
          <option>Farm Stay</option>
          <option>Private Villa</option>
        </select>

        {/* ⭐ Category */}
        <select name="category" className="border p-2 w-full"
          onChange={handleChange} required>
          <option value="">Select Category</option>
          <option>Stay</option>
          <option>Camping</option>
          <option>Experience</option>
        </select>


        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="startDate"
            className="border p-2 w-full" onChange={handleChange} required />
          <input type="date" name="endDate"
            className="border p-2 w-full" onChange={handleChange} required />
        </div>

        <textarea name="description" placeholder="Short Description"
          className="border p-2 w-full h-24" onChange={handleChange} required />

        <input type="file" multiple onChange={handleImage} />

        {/* Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((img, i) => (
              <img key={i} src={img}
                className="h-20 w-full object-cover rounded"/>
            ))}
          </div>
        )}

        <button className="bg-emerald-600 hover:bg-emerald-700
         text-white p-2 w-full rounded font-semibold">
          Submit Listing
        </button>
      </form>
    </div>
  );
}
