import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";

const CITY_OPTIONS = ["Chennai", "Bengaluru", "Trichy", "Dindigul", "Kodaikanal"];

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  fromCity: "Chennai",
  vehicleType: "",
  issue: "",
  notes: "",
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getAssistantDisplayName = (assistant) => {
  const rawName = String(assistant?.name || "").trim();
  if (rawName && rawName.toLowerCase() !== "unknown service") return rawName;
  return "Roadside Assistance";
};

const getAssistantDisplayRating = (assistant) => {
  const value = Number(assistant?.rating || 0);
  return Number.isFinite(value) ? value : 0;
};

export default function RoadsideAssistance() {
  const quoteFormRef = useRef(null);
  const [city, setCity] = useState("Chennai");
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("0");

  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState("success");
  const [selectionMessage, setSelectionMessage] = useState("");

  const params = React.useMemo(() => {
    const q = { city, limit: 24 };
    if (search.trim()) q.search = search.trim();
    if (Number(minRating) > 0) q.minRating = Number(minRating);
    return q;
  }, [city, search, minRating]);

  useEffect(() => {
    const fetchAssistants = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/roadside-assistance", { params });
        setAssistants(Array.isArray(data?.items) ? data.items : []);
        setLastUpdated(data?.meta?.lastUpdated || null);
      } catch (err) {
        console.error("ROAD ASSISTANCE PAGE LOAD ERROR:", err);
        setError("Failed to load roadside assistance right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, [params]);

  const handleSelectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
    setSelectionMessage(
      `${getAssistantDisplayName(assistant)} selected. Fill the form below to submit your request.`
    );
    quoteFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      const payload = {
        ...form,
        fromCity: city,
        assistanceId: selectedAssistant?._id || null,
      };

      const { data } = await api.post("/api/roadside-assistance/quote-requests", payload);
      setSubmitType("success");
      setSubmitMessage(data?.message || "Roadside assistance request submitted successfully");
      setForm({ ...initialForm, fromCity: city });
      setSelectedAssistant(null);
      setSelectionMessage("");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Unable to submit roadside assistance request. Please retry.";
      setSubmitType("error");
      setSubmitMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10">
        <div className="rounded-2xl border border-emerald-100 bg-linear-to-r from-emerald-50 via-teal-50 to-cyan-50 p-5">
        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Roadside Assistance & Vehicle Services</h1>
        <p className="mt-2 text-sm text-slate-700 md:text-base">
          Get help with vehicle breakdowns and roadside assistance across Tamil Nadu and Karnataka.
        </p>
        <p className="mt-2 text-xs text-slate-500">Last updated: {formatDate(lastUpdated)}</p>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setForm((prev) => ({ ...prev, fromCity: e.target.value }));
            }}
            className="rounded-lg border p-2.5"
          >
            {CITY_OPTIONS.map((value) => (
              <option key={value} value={value}>
                From {value}
              </option>
            ))}
          </select>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service/assistant"
            className="rounded-lg border p-2.5"
          />

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="rounded-lg border p-2.5"
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </section>

      <section className="mt-5">
        {loading ? (
          <div className="text-center py-8">Loading roadside assistance...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assistants.map((assistant) => (
              <div key={assistant._id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{getAssistantDisplayName(assistant)}</h3>
                    <p className="text-sm text-gray-600">{assistant.city}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">*</span>
                      <span className="text-sm">{getAssistantDisplayRating(assistant).toFixed(1)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectAssistant(assistant)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Select
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> {assistant.phone}
                  </p>
                  {assistant.services && assistant.services.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Services:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {assistant.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectionMessage && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-emerald-800">{selectionMessage}</p>
        </div>
      )}

      <section ref={quoteFormRef} className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Request Roadside Assistance</h2>
        <form onSubmit={submitQuote} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="rounded-lg border p-3"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg border p-3"
            required
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border p-3"
          />
          <select
            value={form.vehicleType}
            onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
            className="rounded-lg border p-3"
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
            <option value="other">Other</option>
          </select>
          <div className="md:col-span-2">
            <textarea
              placeholder="Describe the issue"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              className="w-full rounded-lg border p-3"
              rows={3}
              required
            />
          </div>
          <div className="md:col-span-2">
            <textarea
              placeholder="Additional notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-lg border p-3"
              rows={2}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
        {submitMessage && (
          <div className={`mt-4 rounded-lg p-3 ${submitType === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
            {submitMessage}
          </div>
        )}
      </section>
    </div>
  );
}

