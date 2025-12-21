// frontend/src/components/AvailabilityCalendar.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/*
 Props:
  - blockedRanges: [{ from: DateString, to: DateString }, ...]
  - selected: { start, end } optional
*/

export default function AvailabilityCalendar({ blockedRanges = [] }) {
  // convert ranges to Date objects
  const ranges = blockedRanges.map(r => ({
    from: new Date(r.from),
    to: new Date(r.to)
  }));

  const isDayBlocked = (date) => {
    return ranges.some(r => date >= r.from && date <= r.to);
  };

  return (
    <div>
      <DatePicker
        inline
        calendarClassName="rounded-xl shadow-md"
        dayClassName={(date) => isDayBlocked(date) ? "opacity-40 line-through text-red-600" : undefined}
      />
      <p className="text-xs text-gray-500 mt-2">Red/struck days are unavailable</p>
    </div>
  );
}
