import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

/* ================= CATEGORIES LIST ================= */
const CATEGORY_OPTIONS = [
  "Backpacker",
  "Forest",
  "Family",
  "Friends",
  "Solo Traveller",
  "Bike Traveller",
  "New Year Trip",
  "Glamping",
  "Mountain",
  "Beach",
  "Desert",
  "Bangalore",
  "Chennai",
];

/* ================= STAY TYPE LIST ================= */
const STAY_TYPES = [
  // Backpacker / Budget
  "Backpacker Hostel",
  "Dormitory / Bed Sharing",
  "Budget Stay",

  // Unique Stays
  "A-Frame Stay",
  "Tent / Camping Stay",
  "Pyramid Stay",
  "Mud House Stay",
  "Glamping Stay",
  "Igloo Stay",
  "Tree House",
  "Glass House / Dome Stay",
  "Cabin / Wooden Cottage",

  // Private Properties
  "Private Villa",
  "Individual Bungalow",
  "Farm Stay",
  "Homestay",

  // Hotels / Resorts
  "Hotel / Rooms",
  "Luxury Hotel",
  "Resort Stay",
  "Luxury Resort",

  // Nature Based
  "Beach Side Stay",
  "Forest Stay",
  "Hill View Stay",
  "Lake View Stay",
];

export default function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    region: "",
    category: "",
    stayType: "",  // ⭐ newly added
    tags: [],
    days: "",
    startDate: "",
    endDate: "",
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const isEdit = Boolean(id);

  /* ============= LOAD PACKAGE WHEN EDIT ============= */
  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      try {
        const res = await api.get(`/api/admin/packages/${id}`);
        const pkg = res.data;

        setForm({
          title: pkg.title || "",
          description: pkg.description || "",
          price: pkg.price || "",
          location: pkg.location || "",
          region: pkg.region || "",
          category: pkg.category || "",
          stayType: pkg.stayType || "",  // ⭐ load existing
          tags: pkg.tags || [],
          days: pkg.days || "",
          startDate: pkg.startDate ? pkg.startDate.split("T")[0] : "",
          endDate: pkg.endDate ? pkg.endDate.split("T")[0] : "",
        });

        setOldImages(pkg.images || []);
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };
    load();
  }, [id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  /* ================= IMAGE HANDLERS ================= */
  const handleImageSelect = (e) => {
    const files = [...e.target.files];
    setNewImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImage = (i) => {
    setNewImages((p) => p.filter((_, x) => x !== i));
    setPreviewImages((p) => p.filter((_, x) => x !== i));
  };

  /* ================= SAVE ================= */
  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "tags") fd.append("tags", JSON.stringify(form.tags));
        else fd.append(key, form[key]); // ⭐ stayType auto included
      });

      newImages.forEach((file) => fd.append("images", file));

      if (isEdit) {
        fd.append("oldImages", JSON.stringify(oldImages));
        await api.put(`/api/admin/packages/${id}`, fd);
        alert("Package Updated ✔");
      } else {
        await api.post(`/api/admin/packages`, fd);
        alert("Package Created 🎉");
      }

      navigate("/admin/packages");
    } catch (err) {
      console.log("SAVE ERR:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Package" : "Add New Package"}
      </h2>

      <form onSubmit={save} className="space-y-4">

        <input className="border p-3 rounded w-full"
          placeholder="Package Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required/>

        <textarea className="border p-3 rounded w-full" rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}/>

        <input className="border p-3 rounded w-full" type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}/>

        <input className="border p-3 rounded w-full"
          placeholder="Location (Ooty...)"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          required/>

        <input className="border p-3 rounded w-full"
          placeholder="Region (Tamil Nadu)"
          value={form.region}
          onChange={(e) => update("region", e.target.value)}
          required/>

        {/* ⭐ CATEGORY DROPDOWN */}
        <select
          className="border p-3 rounded w-full"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          required>
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        {/* ⭐ STAY TYPE DROPDOWN */}
        <select
          className="border p-3 rounded w-full"
          value={form.stayType}
          onChange={(e) => update("stayType", e.target.value)}
          required>
          <option value="">Select Stay Type</option>
          {STAY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Optional Tags */}
        <input className="border p-3 rounded w-full"
          placeholder="Tags (comma separated, optional)"
          value={form.tags.join(", ")}
          onChange={(e) => update("tags", e.target.value.split(",").map(v=>v.trim()))}
        />

        <input className="border p-3 rounded w-full"
          placeholder="Days (e.g. 3D/2N)"
          value={form.days}
          onChange={(e) => update("days", e.target.value)}/>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="border p-3 rounded"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            required/>
          <input type="date" className="border p-3 rounded"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}/>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="border p-4 rounded">
          <p className="font-medium">Upload Images</p>
          <input type="file" multiple onChange={handleImageSelect}/>
        </div>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded text-lg">
          {isEdit ? "Update Package" : "Create Package"}
        </button>
      </form>
    </div>
  );
}
