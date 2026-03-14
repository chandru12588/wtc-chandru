import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { SERVICE_COUNTRIES } from "../constants/countries";
import { GUEST_PLACE_TYPES } from "../constants/guestPlaceTypes";
import { HOST_STAY_TYPES } from "../constants/stayTypes";
import { getHostToken, getHostUser } from "../utils/hostAuth";

const API = import.meta.env.VITE_API_URL;

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/host/listings/${id}`);
        const d = res.data;

        setForm({
          title: d.title,
          description: d.description,
          country: d.country || "",
          state: d.state || "",
          city: d.city || "",
          zipcode: d.zipcode || "",
          whatsappNumber: d.whatsappNumber || "",
          location: d.location,
          price: d.price,
          stayType: d.stayType,
          guestPlaceType: d.guestPlaceType || "",
          category: d.category,
          startDate: d.availableFrom?.split("T")[0] || "",
          endDate: d.availableTo?.split("T")[0] || "",
        });

        setImages(d.images || []);
      } catch {
        alert("Failed to load listing");
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const updateListing = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API}/api/host/listings/${id}`,
        {
          ...form,
          images,
          hostId: host._id,
          availableFrom: form.startDate,
          availableTo: form.endDate,
        },
        { headers: { Authorization: getHostToken() } }
      );

      alert("Listing Updated Successfully!");
      navigate("/host/dashboard");
    } catch {
      alert("Update failed");
    }
  };

  const deleteListing = async () => {
    if (!confirm("Delete this listing?")) return;

    try {
      await axios.delete(`${API}/api/host/listings/${id}`, {
        headers: { Authorization: getHostToken() },
      });

      alert("Listing Deleted");
      navigate("/host/dashboard");
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl border p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Edit Stay Listing</h2>

      <form onSubmit={updateListing} className="space-y-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Stay Title"
          className="w-full border p-2"
          required
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2"
          required
        />

        <select
          name="country"
          value={form.country}
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
            value={form.state}
            placeholder="State"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="city"
            value={form.city}
            placeholder="City"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
          <input
            name="zipcode"
            value={form.zipcode}
            placeholder="Zipcode"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="whatsappNumber"
          value={form.whatsappNumber}
          placeholder="WhatsApp Number for Customers"
          className="w-full border p-2"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price/Night"
          className="w-full border p-2"
          required
        />

        <select
          name="stayType"
          value={form.stayType}
          className="w-full border p-2"
          onChange={handleChange}
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
          value={form.category}
          className="w-full border p-2"
          onChange={handleChange}
          required
        >
          <option>Stay</option>
          <option>Camping</option>
          <option>Experience</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="startDate"
            className="w-full border p-2"
            value={form.startDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endDate"
            className="w-full border p-2"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="h-24 w-full border p-2"
          required
        />

        <input type="file" multiple onChange={handleImage} />

        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-20 w-full rounded object-cover"
            />
          ))}
        </div>

        <button className="w-full rounded bg-blue-600 p-2 font-semibold text-white">
          Update
        </button>

        <button
          type="button"
          onClick={deleteListing}
          className="mt-2 w-full rounded bg-red-600 p-2 font-semibold text-white"
        >
          Delete Listing
        </button>
      </form>
    </div>
  );
}
