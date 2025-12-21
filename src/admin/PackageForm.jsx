import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

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
    days: "",
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const isEdit = Boolean(id);

  /* =============================
      LOAD PACKAGE (EDIT MODE)
  ============================== */
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
          days: pkg.days || "",
        });

        setOldImages(pkg.images || []);
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };

    load();
  }, [id]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  /* =============================
      IMAGE UPLOAD HANDLING
  ============================== */
  const handleImageSelect = (e) => {
    const files = [...e.target.files];
    setNewImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const removeOldImage = (url) =>
    setOldImages((prev) => prev.filter((img) => img !== url));

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* =============================
          SAVE PACKAGE
  ============================== */
  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      newImages.forEach((file) => fd.append("images", file));

      if (isEdit) {
        fd.append("oldImages", JSON.stringify(oldImages));
        await api.put(`/api/admin/packages/${id}`, fd);
        alert("Package updated successfully");
      } else {
        await api.post("/api/admin/packages", fd);
        alert("Package created successfully");
      }

      navigate("/admin/packages");
    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data || err);
      alert("Save Failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Package" : "Add New Package"}
      </h2>

      {/* EXISTING IMAGES */}
      {isEdit && oldImages.length > 0 && (
        <div className="mb-6">
          <p className="font-medium mb-2">Existing Images</p>

          <div className="grid grid-cols-4 gap-3">
            {oldImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} className="w-full h-28 rounded-lg object-cover" />

                <button
                  type="button"
                  onClick={() => removeOldImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW IMAGE PREVIEW */}
      {previewImages.length > 0 && (
        <div className="mb-6">
          <p className="font-medium mb-2">New Images Preview</p>

          <div className="grid grid-cols-4 gap-3">
            {previewImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} className="w-full h-28 rounded-lg object-cover" />

                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-black text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM FIELDS */}
      <form onSubmit={save} className="space-y-4">
        <input
          className="border p-3 rounded w-full"
          placeholder="Package Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <textarea
          className="border p-3 rounded w-full"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <input
          type="number"
          className="border p-3 rounded w-full"
          placeholder="Price"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />

        {/* NEW FIELD — LOCATION */}
        <input
          className="border p-3 rounded w-full"
          placeholder="Location (Example: Ooty)"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          required
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Region (Example: Tamil Nadu)"
          value={form.region}
          onChange={(e) => update("region", e.target.value)}
          required
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Days (e.g., 3D/2N)"
          value={form.days}
          onChange={(e) => update("days", e.target.value)}
        />

        {/* IMAGE INPUT */}
        <div className="border p-4 rounded-lg">
          <p className="font-medium mb-2">Upload Images</p>
          <input type="file" multiple onChange={handleImageSelect} />
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg">
          {isEdit ? "Update Package" : "Create Package"}
        </button>
      </form>
    </div>
  );
}
