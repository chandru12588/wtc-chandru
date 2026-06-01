import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../api.js";
import PenguinLoader from "../components/PenguinLoader.jsx";

const toKey = (value) => new Date(value).toISOString().split("T")[0];

export default function AdminPackageCalendar() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [cursorDate, setCursorDate] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/admin/packages/${id}/calendar-summary`);
        setData(res.data);
      } catch (err) {
        console.error("CALENDAR LOAD ERROR:", err);
        alert("Failed to load package calendar");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const sets = useMemo(() => {
    const available = new Set(data?.availableDates || []);
    const blocked = new Set(data?.blockedDates || []);
    const booked = new Set(data?.bookedDates || []);
    return { available, blocked, booked };
  }, [data]);

  const dayClassName = (date) => {
    const key = toKey(date);
    if (sets.booked.has(key)) return "bg-red-500 text-white rounded-full";
    if (sets.blocked.has(key)) return "bg-amber-400 text-slate-900 rounded-full";
    if ((data?.serviceType || "general") === "general" && sets.available.has(key)) {
      return "bg-emerald-500 text-white rounded-full";
    }
    return "text-slate-500";
  };

  if (loading) return <PenguinLoader message="Loading package calendar..." className="py-8" />;
  if (!data) return <div className="p-4 text-sm text-red-600">No calendar data found.</div>;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Package Calendar</h1>
          <p className="text-sm text-slate-600">{data.title}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/admin/packages/${id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Edit Package
          </Link>
          <Link
            to="/admin/packages"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <DatePicker
          inline
          selected={cursorDate}
          onChange={(d) => setCursorDate(d || new Date())}
          dayClassName={dayClassName}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
          Available Date
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-400" />
          Manually Blocked
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
          Already Booked
        </span>
      </div>
    </div>
  );
}

