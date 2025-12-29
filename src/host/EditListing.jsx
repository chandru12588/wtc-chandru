import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getHostToken, getHostUser } from "../utils/hostAuth";

const API = import.meta.env.VITE_API_URL;

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const host = getHostUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    stayType: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [images, setImages] = useState([]);

  /* Load existing listing */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/api/host/listings/${id}`);
        const d = res.data;

        setForm({
          title: d.title,
          description: d.description,
          location: d.location,
          price: d.price,
          stayType: d.stayType,
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  /* Update Listing */
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

  /* Delete Listing */
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
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Edit Stay Listing</h2>

      <form onSubmit={updateListing} className="space-y-3">

        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Stay Title" className="border p-2 w-full" required />

        <input name="location" value={form.location} onChange={handleChange}
          placeholder="Location" className="border p-2 w-full" required />

        <input name="price" type="number" value={form.price} onChange={handleChange}
          placeholder="Price/Night" className="border p-2 w-full" required />

        <select name="stayType" value={form.stayType} className="border p-2 w-full"
          onChange={handleChange} required>
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

        <select name="category" value={form.category}
          className="border p-2 w-full" onChange={handleChange} required>
          <option>Stay</option>
          <option>Camping</option>
          <option>Experience</option>
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="startDate" className="border p-2 w-full"
            value={form.startDate} onChange={handleChange} required />

          <input type="date" name="endDate" className="border p-2 w-full"
            value={form.endDate} onChange={handleChange} required />
        </div>

        <textarea name="description" value={form.description}
          onChange={handleChange} className="border p-2 w-full h-24" required />

        <input type="file" multiple onChange={handleImage} />

        <div className="grid grid-cols-3 gap-2 mt-2">
          {images.map((img, i) => (
            <img key={i} src={img}
              className="h-20 w-full rounded object-cover" />
          ))}
        </div>

        <button className="bg-blue-600 text-white w-full p-2 rounded font-semibold">
          Update
        </button>

        <button type="button" onClick={deleteListing}
          className="bg-red-600 text-white w-full p-2 rounded mt-2 font-semibold">
          Delete Listing
        </button>
      </form>
    </div>
  );
}
