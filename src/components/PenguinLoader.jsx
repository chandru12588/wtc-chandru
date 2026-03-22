import React from "react";

export default function PenguinLoader({ message = "Loading...", compact = false, className = "" }) {
  const wrapperClass = compact
    ? "flex items-center gap-3 py-2"
    : "flex min-h-[180px] flex-col items-center justify-center gap-3 py-8";

  return (
    <div className={`${wrapperClass} ${className}`}>
      <div className="penguin-loader-track">
        <img src="/favicon.png" alt="Loading" className="penguin-runner" />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
