import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const CITY_OPTIONS = ["Chennai", "Bengaluru", "Trichy"];

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  fromCity: "Chennai",
  travelDate: "",
  travelers: 2,
  budget: "",
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

export default function KodaikanalAgents() {
  const [city, setCity] = useState("Chennai");
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState("success");

  const params = useMemo(() => {
    const q = { city, limit: 24 };
    if (search.trim()) q.search = search.trim();
    if (Number(minRating) > 0) q.minRating = Number(minRating);
    if (maxPrice) q.maxPrice = Number(maxPrice);
    if (verifiedOnly) q.verified = "true";
    return q;
  }, [city, search, minRating, maxPrice, verifiedOnly]);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/api/kodaikanal-agents", { params });
        setAgents(Array.isArray(data?.items) ? data.items : []);
        setLastUpdated(data?.meta?.lastUpdated || null);
      } catch (err) {
        console.error("KODAI AGENTS PAGE LOAD ERROR:", err);
        setError("Failed to load travel agents right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [params]);

  const submitQuote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      const payload = {
        ...form,
        fromCity: city,
        agentId: selectedAgent?._id || null,
        budget: form.budget ? Number(form.budget) : 0,
        travelers: Number(form.travelers || 1),
      };

      const { data } = await api.post("/api/kodaikanal-agents/quote-requests", payload);
      setSubmitType("success");
      setSubmitMessage(data?.message || "Quote request submitted successfully");
      setForm({ ...initialForm, fromCity: city });
      setSelectedAgent(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Unable to submit quote request. Please retry.";
      setSubmitType("error");
      setSubmitMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-5">
        <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
          Kodaikanal Tour Agents
        </h1>
        <p className="mt-2 text-sm text-slate-700 md:text-base">
          Compare agents from Chennai, Bengaluru, and Trichy. Get matched quickly with
          the right Kodaikanal specialist.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Last updated: {formatDate(lastUpdated)}
        </p>
      </div>

      <section className="mt-5 rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
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
            placeholder="Search agent/agency"
            className="rounded-lg border p-2.5 md:col-span-2"
          />

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="rounded-lg border p-2.5"
          >
            <option value="0">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="4.5">4.5+ stars</option>
          </select>

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price (INR)"
            className="rounded-lg border p-2.5"
          />
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Show verified agents only
        </label>
      </section>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-slate-600">Loading agents...</p>}
        {!loading && !agents.length && (
          <p className="text-sm text-slate-600">No agents found for this filter.</p>
        )}

        {!loading &&
          agents.map((agent) => (
            <article key={agent._id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{agent.name}</h2>
                {agent.verified && (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">{agent.agencyName || "Independent Agent"}</p>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>City: {agent.city}</p>
                <p>Rating: {agent.rating || 0} / 5</p>
                <p>Price from: Rs. {Number(agent.priceFrom || 0).toLocaleString("en-IN")}</p>
                <p>Phone: {agent.phone || "N/A"}</p>
                <p>Email: {agent.email || "N/A"}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgent(agent)}
                className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Request Quote From This Agent
              </button>
            </article>
          ))}
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">Get Personalized Quote</h3>
        <p className="mt-1 text-sm text-slate-600">
          Source city: <strong>{city}</strong>{" "}
          {selectedAgent ? (
            <>
              | Selected agent: <strong>{selectedAgent.name}</strong>
            </>
          ) : (
            "| Agent: Auto-match best option"
          )}
        </p>

        {submitMessage && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              submitType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {submitMessage}
          </div>
        )}

        <form onSubmit={submitQuote} className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
            placeholder="Your Name"
            className="rounded-lg border p-2.5"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone Number"
            className="rounded-lg border p-2.5"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email (optional)"
            className="rounded-lg border p-2.5"
          />
          <input
            required
            type="date"
            value={form.travelDate}
            onChange={(e) => setForm((prev) => ({ ...prev, travelDate: e.target.value }))}
            className="rounded-lg border p-2.5"
          />
          <input
            type="number"
            min="1"
            value={form.travelers}
            onChange={(e) => setForm((prev) => ({ ...prev, travelers: e.target.value }))}
            placeholder="No. of travelers"
            className="rounded-lg border p-2.5"
          />
          <input
            type="number"
            min="0"
            value={form.budget}
            onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
            placeholder="Budget (INR)"
            className="rounded-lg border p-2.5"
          />
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Trip preferences (hotel, cab, days, etc.)"
            className="rounded-lg border p-2.5 md:col-span-2"
            rows={4}
          />
          <button
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800 md:col-span-2"
          >
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>
      </section>
    </div>
  );
}
