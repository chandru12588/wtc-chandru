import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

const IMAGE_ACCEPT =
  "image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif,.svg,.heic,.heif,.raw";
const VIDEO_ACCEPT =
  "video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.3gp,.mpeg,.mpg,.wmv";

const CATEGORY_OPTIONS = [
  "Backpacker",
  "Forest",
  "Family",
  "Friends",
  "Solo Traveller",
  "Bike Traveller",
  "Bike Pillion Tour",
  "New Year Trip",
  "Glamping",
  "Mountain",
  "Beach",
  "Desert",
  "Bangalore",
  "Chennai",
];

const STAY_TYPES = [
  "Backpacker Hostel",
  "Dormitory / Bed Sharing",
  "Budget Stay",
  "A-Frame Stay",
  "Tent / Camping Stay",
  "Pyramid Stay",
  "Mud House Stay",
  "Glamping Stay",
  "Igloo Stay",
  "Tree House",
  "Glass House / Dome Stay",
  "Cabin / Wooden Cottage",
  "Private Villa",
  "Individual Bungalow",
  "Farm Stay",
  "Homestay",
  "Hotel / Rooms",
  "Luxury Hotel",
  "Resort Stay",
  "Luxury Resort",
  "Beach Side Stay",
  "Forest Stay",
  "Hill View Stay",
  "Lake View Stay",
  "Pillion Bike Tour",
];

const SERVICE_TYPE_OPTIONS = [
  { value: "general", label: "General Package" },
  { value: "bike", label: "Pillion Rider Service" },
  { value: "guide", label: "Tour Guide Service" },
  { value: "driver", label: "Acting Driver Service" },
];

const SERVICE_PRESETS = {
  general: {
    title: "Add New Package",
    stayTypeLabel: "Stay Type",
    stayTypeOptions: STAY_TYPES,
    descriptionPlaceholder: "Description",
  },
  bike: {
    title: "Add Pillion Rider Service",
    stayTypeLabel: "Service Format",
    stayTypeOptions: ["Pillion Bike Tour", "Bike Escort Ride", "Road Trip Support"],
    descriptionPlaceholder:
      "Explain rider support, safety, petrol sharing, stay sharing, and customer responsibilities.",
  },
  guide: {
    title: "Add Tour Guide Service",
    stayTypeLabel: "Guide Type",
    stayTypeOptions: ["Local Guide", "Professional Tour Guide"],
    descriptionPlaceholder:
      "Explain guide support, included destinations, supported languages, and private or group mode.",
  },
  driver: {
    title: "Add Acting Driver Service",
    stayTypeLabel: "Driver Service Type",
    stayTypeOptions: [
      "Acting Driver - Local",
      "Acting Driver - Outstation",
      "Acting Driver - Business Trip",
    ],
    descriptionPlaceholder:
      "Explain assignment flow, car documents required, and customer responsibility for fuel and trip expenses.",
  },
};

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
    serviceType: "general",
    stayType: "",
    tags: [],
    days: "",
    startDate: "",
    endDate: "",
    guideType: "Local Guide",
  });

  const [oldImages, setOldImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [replacementImages, setReplacementImages] = useState({});
  const [oldVideos, setOldVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);

  const isEdit = Boolean(id);
  const preset = SERVICE_PRESETS[form.serviceType] || SERVICE_PRESETS.general;
  const isPillionService = form.serviceType === "bike";
  const isGuideService = form.serviceType === "guide";
  const isDriverService = form.serviceType === "driver";

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
          serviceType: pkg.serviceType || "general",
          stayType: pkg.stayType || "",
          tags: pkg.tags || [],
          days: pkg.days || "",
          startDate: pkg.startDate ? pkg.startDate.split("T")[0] : "",
          endDate: pkg.endDate ? pkg.endDate.split("T")[0] : "",
          guideType: pkg.guideType || "Local Guide",
        });

        setOldImages(pkg.images || []);
        setOldVideos(pkg.videos || []);
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
    };

    load();
  }, [id, isEdit]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleServiceTypeChange = (value) => {
    const nextPreset = SERVICE_PRESETS[value] || SERVICE_PRESETS.general;

    setForm((prev) => ({
      ...prev,
      serviceType: value,
      stayType: nextPreset.stayTypeOptions.includes(prev.stayType)
        ? prev.stayType
        : nextPreset.stayTypeOptions[0] || "",
      price:
        value === "guide"
          ? prev.price || "0"
          : value === "driver"
          ? prev.price || "1500"
          : prev.price,
      category: value === "driver" ? "Acting Driver Service" : prev.category,
      location: value === "driver" ? "Customer Request" : prev.location,
      region: value === "driver" ? "Flexible" : prev.region,
      days: value === "driver" ? "As per customer requirement" : prev.days,
      startDate: value === "driver" ? prev.startDate || "2099-01-01" : prev.startDate,
      endDate: value === "driver" ? "" : prev.endDate,
      guideType: value === "guide" ? prev.guideType || "Local Guide" : prev.guideType,
    }));
  };

  const handleImageSelect = (e) => {
    setNewImages([...e.target.files]);
  };

  const removeExistingImage = (imageUrl) => {
    setOldImages((prev) => prev.filter((image) => image !== imageUrl));
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleReplaceImage = (imageUrl, file) => {
    if (!file) return;

    setReplacementImages((prev) => ({
      ...prev,
      [imageUrl]: file,
    }));
  };

  const removeExistingVideo = (videoUrl) => {
    setOldVideos((prev) => prev.filter((video) => video !== videoUrl));
  };

  const handleVideoSelect = (e) => {
    setNewVideos([...e.target.files]);
  };

  const removeNewVideo = (indexToRemove) => {
    setNewVideos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearReplacementImage = (imageUrl) => {
    setReplacementImages((prev) => {
      const next = { ...prev };
      delete next[imageUrl];
      return next;
    });
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      const payload =
        isPillionService || isGuideService || isDriverService
          ? {
              ...form,
              price: isGuideService ? 0 : form.price,
              category: isGuideService
                ? "Guide Service"
                : isDriverService
                ? "Acting Driver Service"
                : form.category,
              location:
                isGuideService || isDriverService
                  ? "Customer Requirement"
                  : "Customer Request",
              region: "Flexible",
              days: "As per customer requirement",
              startDate: form.startDate || "2099-01-01",
              endDate: "",
            }
          : form;

      Object.keys(payload).forEach((key) => {
        if (key === "tags") {
          fd.append(key, JSON.stringify(payload[key]));
          return;
        }

        fd.append(key, payload[key] ?? "");
      });

      newImages.forEach((file) => fd.append("images", file));
      newVideos.forEach((file) => fd.append("videos", file));

      if (isEdit) {
        fd.append("oldImages", JSON.stringify(oldImages));
        fd.append("oldVideos", JSON.stringify(oldVideos));
        const replacementEntries = Object.entries(replacementImages);
        fd.append(
          "replacementTargets",
          JSON.stringify(replacementEntries.map(([imageUrl]) => imageUrl))
        );
        replacementEntries.forEach(([, file]) => fd.append("replacementImages", file));
        await api.put(`/api/admin/packages/${id}`, fd);
        alert("Package updated");
      } else {
        await api.post("/api/admin/packages", fd);
        alert("Package created");
      }

      navigate("/admin/packages");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-semibold">
        {isEdit ? "Edit Package" : preset.title}
      </h2>

      <form onSubmit={save} className="space-y-4">
        <input
          className="w-full rounded border p-3"
          placeholder="Package Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />

        <textarea
          className="w-full rounded border p-3"
          rows={5}
          placeholder={preset.descriptionPlaceholder}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />

        {!isPillionService && !isGuideService && (
          <>
            <input
              className="w-full rounded border p-3"
              type="number"
              placeholder={form.serviceType === "driver" ? "Driver Charge Per Day" : "Price"}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />

            {!isDriverService && (
              <>
                <input
                  className="w-full rounded border p-3"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  required
                />

                <input
                  className="w-full rounded border p-3"
                  placeholder="Region"
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                  required
                />
              </>
            )}
          </>
        )}

        {!isGuideService && !isDriverService && (
          <select
            className="w-full rounded border p-3 cursor-pointer"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <select
          className="w-full rounded border p-3 cursor-pointer"
          value={form.serviceType}
          onChange={(e) => handleServiceTypeChange(e.target.value)}
          required
        >
          {SERVICE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <p className="text-sm font-medium text-gray-700">{preset.stayTypeLabel}</p>
        <select
          className="w-full rounded border p-3 cursor-pointer"
          value={form.stayType}
          onChange={(e) => update("stayType", e.target.value)}
          required
        >
          <option value="">Select {preset.stayTypeLabel}</option>
          {preset.stayTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {isGuideService && (
          <>
            <div className="rounded border p-4">
              <p className="mb-3 text-sm font-medium text-gray-700">Guide Type</p>
              <select
                className="w-full rounded border p-3 cursor-pointer"
                value={form.guideType}
                onChange={(e) => update("guideType", e.target.value)}
              >
                <option value="Local Guide">Local Guide</option>
                <option value="Professional Tour Guide">Professional Tour Guide</option>
              </select>
            </div>
            <p className="rounded border border-dashed p-4 text-sm text-gray-600">
              Private or group mode, language, destination, and pricing will be chosen when the
              customer submits the guide request.
            </p>
          </>
        )}

        <input
          className="w-full rounded border p-3"
          placeholder="Tags (comma separated, optional)"
          value={form.tags.join(", ")}
          onChange={(e) =>
            update(
              "tags",
              e.target.value
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean)
            )
          }
        />

        {!isPillionService && !isGuideService && !isDriverService && (
          <>
            <input
              className="w-full rounded border p-3"
              placeholder="Days (e.g. 3D/2N)"
              value={form.days}
              onChange={(e) => update("days", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="rounded border p-3 cursor-pointer"
                value={form.startDate}
                onChange={(e) => update("startDate", e.target.value)}
                required
              />
              <input
                type="date"
                className="rounded border p-3 cursor-pointer"
                value={form.endDate}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </div>
          </>
        )}

        <div className="rounded border p-4">
          <p className="font-medium">Upload Images</p>
          {isEdit && oldImages.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {oldImages.map((imageUrl) => (
                <div key={imageUrl} className="rounded-lg border p-3">
                  <img
                    src={imageUrl}
                    alt="Package"
                    className="h-40 w-full rounded object-cover"
                  />
                  {replacementImages[imageUrl] ? (
                    <p className="mt-2 text-xs text-emerald-700">
                      Replacement selected: {replacementImages[imageUrl].name}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                      Change Picture
                      <input
                        type="file"
                        accept={IMAGE_ACCEPT}
                        className="hidden"
                        onChange={(e) =>
                          handleReplaceImage(imageUrl, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {replacementImages[imageUrl] ? (
                      <button
                        type="button"
                        onClick={() => clearReplacementImage(imageUrl)}
                        className="rounded bg-gray-100 px-3 py-2 text-sm text-gray-700"
                      >
                        Clear Change
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                    >
                      Delete Picture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            multiple
            accept={IMAGE_ACCEPT}
            onChange={handleImageSelect}
            className="mt-4 cursor-pointer"
          />
          {newImages.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {newImages.map((file, index) => (
                <div key={`${file.name}-${index}`} className="rounded-lg border p-3">
                  <p className="truncate text-sm text-gray-700">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="mt-3 rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    Remove New Picture
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded border p-4">
          <p className="font-medium">Upload Videos (Optional)</p>
          {isEdit && oldVideos.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {oldVideos.map((videoUrl) => (
                <div key={videoUrl} className="rounded-lg border p-3">
                  <video controls className="h-40 w-full rounded object-cover">
                    <source src={videoUrl} />
                  </video>
                  <button
                    type="button"
                    onClick={() => removeExistingVideo(videoUrl)}
                    className="mt-3 rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    Delete Video
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            multiple
            accept={VIDEO_ACCEPT}
            onChange={handleVideoSelect}
            className="mt-4 cursor-pointer"
          />
          {newVideos.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {newVideos.map((file, index) => (
                <div key={`${file.name}-${index}`} className="rounded-lg border p-3">
                  <p className="truncate text-sm text-gray-700">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => removeNewVideo(index)}
                    className="mt-3 rounded bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    Remove New Video
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="rounded bg-indigo-600 px-6 py-3 text-lg text-white cursor-pointer">
          {isEdit ? "Update Package" : "Create Package"}
        </button>
      </form>
    </div>
  );
}
